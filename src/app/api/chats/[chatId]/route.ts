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

  const chat = await chatsCollection.findOne({
    _id: objectId,
    userId: session.user.id,
  });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: chat._id.toString(),
    title: chat.title ?? "New chat",
    lastMessagePreview: chat.lastMessagePreview ?? null,
    updatedAt: chat.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    saved: Boolean(chat.saved),
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
  const saved: boolean | undefined = body.saved;

  if (typeof saved !== "boolean") {
    return NextResponse.json(
      { error: "Missing or invalid 'saved' property" },
      { status: 400 }
    );
  }

  const chatsCollection = db.collection("chats");

  const updateResult = await chatsCollection.findOneAndUpdate(
    {
      _id: objectId,
      userId: session.user.id,
    },
    {
      $set: {
        saved,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!updateResult) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: updateResult._id.toString(),
    saved: Boolean(updateResult.saved),
  });
}

