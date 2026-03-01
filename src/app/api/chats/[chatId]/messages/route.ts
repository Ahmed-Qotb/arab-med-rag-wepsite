import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db, connectMongoClient } from "@/lib/db";

type RouteParams = {
  params: {
    chatId: string;
  };
};

export async function GET(_: Request, { params }: RouteParams) {
  await connectMongoClient();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chatId = params.chatId;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(chatId);
  } catch {
    return NextResponse.json({ error: "Invalid chat id" }, { status: 400 });
  }

  const chatsCollection = db.collection("chats");
  const messagesCollection = db.collection("messages");

  const chat = await chatsCollection.findOne({
    _id: objectId,
    userId: session.user.id,
  });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const messages = await messagesCollection
    .find({
      chatId: objectId,
      userId: session.user.id,
    })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json({
    messages: messages.map((message) => ({
      id: message._id.toString(),
      role: message.role,
      content: message.content,
      createdAt: message.createdAt?.toISOString?.() ?? new Date().toISOString(),
    })),
  });
}

export async function POST(request: Request, { params }: RouteParams) {
  await connectMongoClient();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chatId = params.chatId;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(chatId);
  } catch {
    return NextResponse.json({ error: "Invalid chat id" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const content: string | undefined = body.content;

  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'content' property" },
      { status: 400 }
    );
  }

  const chatsCollection = db.collection("chats");
  const messagesCollection = db.collection("messages");

  const chat = await chatsCollection.findOne({
    _id: objectId,
    userId: session.user.id,
  });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const now = new Date();

  // Insert user message
  const userInsertResult = await messagesCollection.insertOne({
    chatId: objectId,
    userId: session.user.id,
    role: "user",
    content,
    createdAt: now,
  });

  const userMessage = {
    id: userInsertResult.insertedId.toString(),
    role: "user" as const,
    content,
    createdAt: now.toISOString(),
  };

  // Dummy AI response
  const aiContent = `This is a dummy AI response to: "${content}"`;
  const aiNow = new Date();

  const aiInsertResult = await messagesCollection.insertOne({
    chatId: objectId,
    userId: session.user.id,
    role: "ai",
    content: aiContent,
    createdAt: aiNow,
  });

  const aiMessage = {
    id: aiInsertResult.insertedId.toString(),
    role: "ai" as const,
    content: aiContent,
    createdAt: aiNow.toISOString(),
  };

  // Update chat metadata
  await chatsCollection.updateOne(
    { _id: objectId, userId: session.user.id },
    {
      $set: {
        lastMessagePreview: aiContent,
        updatedAt: aiNow,
      },
      $setOnInsert: {
        title:
          chat.title ||
          (content.length > 40 ? `${content.slice(0, 40)}...` : content),
      },
    }
  );

  return NextResponse.json(
    {
      userMessage,
      aiMessage,
    },
    { status: 201 }
  );
}

