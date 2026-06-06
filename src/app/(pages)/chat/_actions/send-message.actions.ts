"use server";

import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { requireAuth, AuthError } from "@/lib/api-utils";
import { queryAI } from "@/lib/ai-api";
import type { ChatMode } from "@/lib/chat";
import { buildHistory } from "../_utils/main-chat.utils";
import type { SendMessageResponse } from "../_utils/main-chat.utils";
import { parseApiResponse } from "@/lib/text-utils";

export async function sendMessageAction(
  chatId: string,
  content: string,
  mode: ChatMode
): Promise<SendMessageResponse> {
  const user = await requireAuth();

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(chatId);
  } catch {
    throw new AuthError("Invalid chat id");
  }

  const chatsCollection = db.collection("chats");

  const chat = await chatsCollection.findOne({ _id: objectId, userId: user.id });
  if (!chat) {
    throw new Error("Chat not found");
  }

  // Build rolling 4-pair history from stored messages
  const storedMessages = (chat.messages ?? []).map((msg: any) => ({
    id: msg._id?.toString() ?? new ObjectId().toString(),
    role: msg.role as "user" | "ai",
    content: msg.content as string,
    createdAt: msg.createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  const history = buildHistory(storedMessages);

  // Call the AI API
  const aiResult = await queryAI({ query: content, mode, history });

  // Split the raw answer: clean text vs. RAG retrieval chunks
  const { cleanAnswer, retrievedContext } = parseApiResponse(aiResult.answer);

  const now = new Date();
  const userMessageId = new ObjectId();
  const aiMessageId = new ObjectId();

  const userMessage = {
    _id: userMessageId,
    role: "user",
    content,
    createdAt: now,
  };

  const aiMessage = {
    _id: aiMessageId,
    role: "ai",
    content: cleanAnswer,
    ...(retrievedContext && { retrievedContext }),
    createdAt: new Date(),
  };

  const shouldSetTitle = !chat.title || chat.title === "محادثة جديدة";
  const newTitle = shouldSetTitle
    ? content.trim().split(/\s+/).slice(0, 3).join(" ")
    : (chat.title as string);

  const previewText = cleanAnswer.trim().split(/\s+/).slice(0, 10).join(" ");

  const updateResult = await chatsCollection.findOneAndUpdate(
    { _id: objectId, userId: user.id },
    {
      $push: { messages: { $each: [userMessage, aiMessage] } } as any,
      $set: {
        lastMessagePreview: previewText,
        ...(shouldSetTitle && { title: newTitle }),
        updatedAt: aiMessage.createdAt,
      },
    },
    { returnDocument: "after" }
  );

  return {
    userMessage: {
      id: userMessageId.toString(),
      role: "user",
      content,
      createdAt: now.toISOString(),
    },
    aiMessage: {
      id: aiMessageId.toString(),
      role: "ai",
      content: cleanAnswer,
      ...(retrievedContext && { retrievedContext }),
      createdAt: aiMessage.createdAt.toISOString(),
    },
    retrievedContext: retrievedContext || undefined,
    meta: aiResult.meta,
    disclaimer: aiResult.disclaimer,
    chat: {
      title: (updateResult?.title as string) ?? newTitle,
      lastMessagePreview: (updateResult?.lastMessagePreview as string) ?? previewText,
    },
  };
}
