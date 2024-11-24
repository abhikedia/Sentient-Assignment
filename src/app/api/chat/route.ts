import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages, temperature, top_p, frequency_penalty, presence_penalty } =
    await req.json();

  const result = streamText({
    model: google("gemini-1.5-flash-latest"),
    system: "You are a helpful assistant.",
    messages,
    temperature,
    topP: top_p,
    frequencyPenalty: frequency_penalty,
    presencePenalty: presence_penalty,
  });

  return result.toDataStreamResponse();
}
