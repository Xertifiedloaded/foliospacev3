import { NextResponse } from "next/server";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { gateway } from "@/lib/gateway";
import {
  DEFAULT_MODEL,
  SUPPORTED_MODELS,
} from "@/lib/constants";

export const maxDuration = 60;

/* ---------------- GET: Available Models ---------------- */

export async function GET() {
  const allModels = await gateway.getAvailableModels();

  return NextResponse.json({
    models: allModels.models.filter((model) =>
      SUPPORTED_MODELS.includes(model.id)
    ),
  });
}

/* ---------------- POST: Chat Streaming ---------------- */

export async function POST(req: Request) {
  const {
    messages,
    modelId = DEFAULT_MODEL,
  }: {
    messages: UIMessage[];
    modelId: string;
  } = await req.json();

  if (!SUPPORTED_MODELS.includes(modelId)) {
    return new Response(
      JSON.stringify({ error: `Model ${modelId} is not supported` }),
      { status: 400 }
    );
  }

  // ✅ IMPORTANT FIX
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: gateway(modelId),
    system: "You are a software engineer exploring Generative AI.",
    messages: modelMessages, // ✅ now it's a real array
    onError(error) {
      console.error("Error while streaming:", error);
    },
  });

  return result.toUIMessageStreamResponse();
}

