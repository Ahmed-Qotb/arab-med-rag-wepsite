import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { requireAuth, handleApiError, AuthError } from "@/lib/api-utils";

type RouteParams = {
  params: Promise<{
    chatId: string;
  }>;
};

function parseObjectId(id: string): ObjectId {
  try {
    return new ObjectId(id);
  } catch {
    throw new AuthError("Invalid chat id");
  }
}

/**
 * GET /api/chats/:chatId/messages
 * Fetch all messages for a specific chat.
 */
export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { chatId } = await params;
    const user = await requireAuth();

    const objectId = parseObjectId(chatId);

    const chatsCollection = db.collection("chats");

    const chat = await chatsCollection.findOne(
      { _id: objectId, userId: user.id },
      { projection: { messages: 1 } }
    );

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = (chat.messages ?? []).map((msg: any) => ({
      id: msg._id?.toString() ?? new ObjectId().toString(),
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt?.toISOString?.() ?? new Date().toISOString(),
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return handleApiError(error);
  }
}

/**
 * POST /api/chats/:chatId/messages
 * Send a message to a chat. Creates user message and dummy AI response.
 * Body: { content: string }
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { chatId } = await params;
    const user = await requireAuth();

    const objectId = parseObjectId(chatId);

    const body = await request.json().catch(() => ({}));
    const content: string | undefined = body.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'content' property" },
        { status: 400 }
      );
    }

    const chatsCollection = db.collection("chats");

    const chat = await chatsCollection.findOne({
      _id: objectId,
      userId: user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const now = new Date();
    const userMessageId = new ObjectId();

    const userMessage = {
      _id: userMessageId,
      role: "user",
      content,
      createdAt: now,
    };

    // Dummy AI response (replace with actual AI integration later)
    const aiContent = `This is a dummy AI response to: "${content}"`;
    const aiNow = new Date();
    const aiMessageId = new ObjectId();

    const aiMessage = {
      _id: aiMessageId,
      role: "ai",
      content: aiContent,
      createdAt: aiNow,
    };

    // Only set title on first message (if chat.title is default/original)
    const shouldSetTitle = !chat.title || chat.title === "محادثة جديدة";
    const newTitle = shouldSetTitle
      ? content.trim().split(/\s+/).slice(0, 3).join(" ")
      : chat.title;

    // Add messages to the chat's messages array
    const updateResult = await chatsCollection.findOneAndUpdate(
      { _id: objectId, userId: user.id },
      {
        $push: {
          messages: {
            $each: [userMessage, aiMessage],
          },
        },
        $set: {
          lastMessagePreview: aiContent,
          ...(shouldSetTitle && { title: newTitle }),
          updatedAt: aiNow,
        },
      },
      {
        returnDocument: "after",
      }
    );

    const responseTitle = updateResult?.title ?? newTitle;
    const responsePreview = updateResult?.lastMessagePreview ?? aiContent;

    return NextResponse.json(
      {
        userMessage: {
          id: userMessageId.toString(),
          role: "user" as const,
          content,
          createdAt: now.toISOString(),
        },
        aiMessage: {
          id: aiMessageId.toString(),
          role: "ai" as const,
          content: aiContent,
          createdAt: aiNow.toISOString(),
        },
        chat: {
          title: responseTitle,
          lastMessagePreview: responsePreview,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return handleApiError(error);
  }
}
