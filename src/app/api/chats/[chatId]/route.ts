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
 * GET /api/chats/:chatId
 * Fetch a single chat by ID for the authenticated user.
 */
export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { chatId } = await params;
    const user = await requireAuth();

    const objectId = parseObjectId(chatId);

    const chatsCollection = db.collection("chats");

    const chat = await chatsCollection.findOne({
      _id: objectId,
      userId: user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: chat._id.toString(),
      title: chat.title ?? null,
      lastMessagePreview: chat.lastMessagePreview ?? null,
      updatedAt: chat.updatedAt?.toISOString?.() ?? new Date().toISOString(),
      saved: Boolean(chat.saved),
    });
  } catch (error) {
    // Don't override specific AuthError (like invalid chat id)
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return handleApiError(error);
  }
}

/**
 * POST /api/chats/:chatId
 * Update a chat (e.g., toggle saved status).
 * Body: { saved: boolean }
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { chatId } = await params;
    const user = await requireAuth();

    const objectId = parseObjectId(chatId);

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
        userId: user.id,
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
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return handleApiError(error);
  }
}
