import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow straming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validar que tenemos mensajes
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Configurar el  modelo desde variables de entorno o usar predeterminado
    const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Crear el stream de texto
    const result = streamText({
      model: openai(modelName),
      messages,
      temperature: 0.7,
      maxTokens: Number(process.env.MAX_TOKENS) || 2000,
    });

    //Devolver la respuesta como stream
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
      }
    );
  }
}
