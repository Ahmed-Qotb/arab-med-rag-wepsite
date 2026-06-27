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

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
