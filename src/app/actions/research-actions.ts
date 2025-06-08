/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { generateText, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchExa } from "@/lib/exa";
import type { ResearchResult } from "@/lib/types";
import { z } from "zod";

export async function initialResearch(
  topic: string
): Promise<ResearchResult[]> {
  try {
    // 1. Realizar busqueda con Exa API
    const searchResults = await searchExa(topic, 15);

    // 2. Preparar los resultados para el LLM, categorizacion
    const resultsForCategorization = searchResults.map((result) => ({
      id: result.id,
      title: result.title,
      url: result.url,
      snippet: result.text || result.content || "",
      score: result.score,
      source: new URL(result.url).hostname.replace("www.", ""),
    }));

    // 3. Generar categorias usando GPT
    const categorizedResults = await categorizeResults(
      resultsForCategorization
    );
    return categorizedResults;
  } catch (error) {
    console.error("Error en la investigacion:", error);
    throw new Error("No se pudo realizar la investigacion");
  }
}

async function categorizeResults(results: any[]): Promise<ResearchResult[]> {
  try {
    // Usar generateObject para categorizar todos los resultados de una sola vez
    const { object } = await generateObject({
      model: openai(process.env.OPENAI_MODEL || "gpt-3.5-turbo"),
      schema: z.object({
        categorizedResults: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            url: z.string(),
            snippet: z.string(),
            score: z.number(),
            source: z.string(),
            worthExpanding: z
              .boolean()
              .describe(
                "Merece la pena ampliar este resultado en un artículo completo"
              ),
            reason: z
              .string()
              .describe("Breve motivo de la decisión de categorización"),
          })
        ),
      }),
      prompt: `
        Evalúa los siguientes resultados de investigación y determina cuáles valen la pena expandir en un artículo completo.
        
        Para cada resultado, evalúa:
        1. Relevancia y profundidad del contenido
        2. Potencial para generar un artículo informativo
        3. Credibilidad de la fuente
        4. Actualidad de la información
        
        Resultados a evaluar:
        ${JSON.stringify(results, null, 2)}
        
        Devuelve un objeto con un array "categorizedResults" que contenga cada resultado con un campo adicional "worthExpanding" (boolean) 
        y un campo "reason" con una breve explicación de la decisión.
      `,
    });
    return object.categorizedResults;
  } catch (error) {
    console.error("Error en la categorizacion:", error);

    // Si hay un error, intentamos categorizar uno por uno
    return categorizeResultsIndividually(results);
  }
}

// Funcion de respaldo para categorizar resultados individualmente
async function categorizeResultsIndividually(
  results: any[]
): Promise<ResearchResult[]> {
  const categorizedResults: ResearchResult[] = [];

  for (const result of results) {
    try {
      const { text: categorization } = await generateText({
        model: openai(process.env.OPENAI_MODEL || "gpt-3.5-turbo"),
        prompt: `
          Evalúa si este resultado de investigación vale la pena expandir en un artículo completo.
          
          Título: ${result.title}
          URL: ${result.url}
          Extracto: ${result.snippet}
          
          Responde solo con "EXPANDIR" o "NO EXPANDIR" basado en:
          1. Relevancia y profundidad del contenido
          2. Potencial para generar un artículo informativo
          3. Credibilidad de la fuente
          4. Actualidad de la información
        `,
      });

      categorizedResults.push({
        id: result.id,
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        source: result.source,
        score: result.score,
        worthExpanding: categorization.includes("EXPANDIR"),
        reason: "Evaluación Individual",
      });
    } catch (error) {
      console.error("Error en la evaluación individual:", error);

      //Si falla, asumimos que no vale la pena expandir
      categorizedResults.push({
        ...result,
        worthExpanding: false,
        reason: "Error en la evaluación individual",
      });
    }
  }
  return categorizedResults;
}
