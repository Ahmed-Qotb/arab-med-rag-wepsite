import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, handleApiError } from "@/lib/api-utils";

/**
 * GET /api/chats
 * Fetch all chats for the authenticated user.
 * Optional query param: ?saved=true to filter only saved chats
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    const url = new URL(request.url);
    const savedParam = url.searchParams.get("saved");

    const filter: Record<string, unknown> = {
      userId: user.id,
    };

    if (savedParam === "true") {
      filter.saved = true;
    }

    const chatsCollection = db.collection("chats");
    const chats = await chatsCollection
      .find(filter)
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({
      chats: chats.map((chat: any) => ({
        id: chat._id.toString(),
        title: chat.title ?? null,
        lastMessagePreview: chat.lastMessagePreview ?? null,
        updatedAt: chat.updatedAt?.toISOString?.() ?? new Date().toISOString(),
        saved: Boolean(chat.saved),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/chats
 * Create a new chat for the authenticated user.
 * Body: { title?: string, saved?: boolean }
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    const body = await request.json().catch(() => ({}));

    const now = new Date();
    const title: string = body.title || "محادثة جديدة";
    const saved: boolean = Boolean(body.saved);

    const chatsCollection = db.collection("chats");

    const insertResult = await chatsCollection.insertOne({
      userId: user.id,
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
  } catch (error) {
    return handleApiError(error);
  }
}
