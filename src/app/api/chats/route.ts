import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db, connectMongoClient } from "@/lib/db";

export async function GET(request: Request) {
  await connectMongoClient();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const savedParam = url.searchParams.get("saved");

  const filter: Record<string, unknown> = {
    userId: session.user.id,
  };

  if (savedParam === "true") {
    filter.saved = true;
  }

  const chatsCollection = db.collection("chats");
  const chats = await chatsCollection
    .find(filter)
    .sort({ updatedAt: -1 })
    .project({
      title: 1,
      lastMessagePreview: 1,
      updatedAt: 1,
      saved: 1,
    })
    .toArray();

  return NextResponse.json({
    chats: chats.map((chat) => ({
      id: chat._id.toString(),
      title: chat.title ?? "New chat",
      lastMessagePreview: chat.lastMessagePreview ?? null,
      updatedAt: chat.updatedAt?.toISOString?.() ?? new Date().toISOString(),
      saved: Boolean(chat.saved),
    })),
  });
}

export async function POST(request: Request) {
  await connectMongoClient();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const now = new Date();
  const title: string = body.title || "New chat";
  const saved: boolean = Boolean(body.saved);

  const chatsCollection = db.collection("chats");

  const insertResult = await chatsCollection.insertOne({
    userId: session.user.id,
    title,
    lastMessagePreview: null,
    saved,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(
    {
      id: insertResult.insertedId.toString(),
      title,
      lastMessagePreview: null,
      updatedAt: now.toISOString(),
      saved,
    },
    { status: 201 }
  );
}

