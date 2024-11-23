import { OllamaApiConfiguration } from 'modelfusion';
import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText } from "modelfusion";

const apiConfig: OllamaApiConfiguration = ollama.Api({
  baseUrl: "http://localhost:11434",
});

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();
  console.log("messages: -> " + JSON.stringify(messages))
  const textStream = await streamText({
    model: ollama.ChatTextGenerator({ api: apiConfig, model: "huynhkhanh226/rmhllama1.0" }).withChatPrompt(),
    prompt: {
      system:
        "You are an AI chat bot. " +
        "Follow the user's instructions carefully.",
      // map Vercel AI SDK Message to ModelFusion ChatMessage:
      messages: asChatMessages(messages),
    },
  });

  // Return the result using the Vercel AI SDK:
  return new StreamingTextResponse(
    ModelFusionTextStream(
      textStream,
      // optional callbacks:
      {
        onStart() {
          console.log("onStart");
        },
        onToken(token) {
          console.log("onToken", token);
        },
        onCompletion: () => {
          console.log("onCompletion");
        },
        onFinal(completion) {
          console.log("onFinal", completion);
        },
      }
    )
  );
}
