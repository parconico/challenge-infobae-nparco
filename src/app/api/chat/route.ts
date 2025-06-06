import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
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

    // Configurar el modelo desde variables de entorno o usar el predeterminado
    const modelName = process.env.OPENAI_MODEL || "gpt-4o";

    // Crear el stream de texto
    const result = streamText({
      model: openai(modelName),
      messages: [
        {
          role: "system",
          content: `Eres un asistente experto en reescritura y edición de artículos. Tu trabajo es reinterpretar artículos siguiendo las instrucciones específicas del usuario. 

Cuando recibas un artículo y instrucciones:
1. Lee cuidadosamente el artículo original
2. Aplica las modificaciones solicitadas
3. Mantén la información factual importante
4. Asegúrate de que el resultado sea coherente y bien estructurado
5. Conserva un tono profesional a menos que se solicite lo contrario

Responde únicamente con el artículo reinterpretado, sin comentarios adicionales.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: Number(process.env.OPENAI_MAX_TOKENS || 3000),
    });

    // Devolver la respuesta como stream
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
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
