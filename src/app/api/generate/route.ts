import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { encode } from "gpt-3-encoder";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, temperature, top_p, frequency_penalty, presence_penalty } =
    await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [{ role: "user", content: prompt }],
    temperature,
    top_p,
    frequency_penalty,
    presence_penalty,
  });

  const stream = OpenAIStream(response, {
    onToken: (token) => {
      // You can implement more accurate token counting here if needed
    },
  });

  return new StreamingTextResponse(stream);
}
