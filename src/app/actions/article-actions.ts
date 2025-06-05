"use server";

import { generateText, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import * as cheerio from "cheerio";

export async function generateArticleFromUrl(url: string): Promise<string> {
  try {
    // 1. Obtener el contenido de la url
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the URL: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // 2. Extraer el texto principal usando Cheerio
    const textContent = extractTextFromHtml(html);

    // 3. Generar el articulo usando GPT
    const { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      maxTokens: Number(process.env.MAX_TOKENS) || 4000,
      prompt: `
        Basándote en la siguiente información extraída de una página web, 
        genera un artículo bien estructurado y coherente. El artículo debe ser 
        informativo, objetivo y mantener el tono profesional.
        
        URL de origen: ${url}
        
        Contenido extraído:
        ${textContent.substring(
          0,
          8000
        )} // Limitamos para evitar tokens excesivos
        
        Por favor, estructura el artículo con:
        - Un título atractivo
        - Una introducción clara que presente el tema
        - Desarrollo del tema con subtítulos para cada sección principal
        - Puntos clave y datos relevantes
        - Una conclusión que resuma los puntos principales
        - Formato con párrafos bien definidos y espaciados
      `,
    });
    return text;
  } catch (error) {
    console.error("Error generating article:", error);
    throw new Error(
      `No se pudo generar el articulo:  ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function generateTitlesFromArticle(
  article: string,
  count: number
): Promise<string[]> {
  try {
    const { object } = await generateObject({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      schema: z.object({
        titles: z
          .array(z.string())
          .describe("Array of creative and engaging article titles"),
      }),
      prompt: `
        Generate ${count} creative, engaging, and SEO-friendly titles for the following article.
        The titles should be:
        - Attention-grabbing and clickable
        - Relevant to the article content
        - Between 40-60 characters when possible
        - Varied in style (some questions, some statements, some with numbers)
        
        Article content:
        ${article.substring(0, 3000)}
        
        Return exactly ${count} titles in the titles array.
      `,
    });

    return object.titles;
  } catch (error) {
    console.error("Error generating titles:", error);
    throw new Error(
      `No se pudo generar los títulos: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// Funcion para extraer el texto principal de un HTML usando cheerio
function extractTextFromHtml(html: string): string {
  try {
    const $ = cheerio.load(html);
    // Remover elementos no deseados
    $(
      "script, style, nav, footer, header, aside, [role=banner], [role=navigation], .ads, .banner, .cookie, .popup"
    ).remove();

    //Extraer el texto del contenido principal
    let mainContent = "";

    //Intentar encontrar el contenido principal usando selectores comunes
    const contentSelectors = [
      "article",
      "main",
      ".content",
      ".post-content",
      ".article-content",
      ".entry-content",
      "#content",
      ".main-content",
    ];

    for (const selector of contentSelectors) {
      if ($(selector).length) {
        mainContent = $(selector).text();
        break;
      }
    }

    // Si no se encuentra contenido, usar el texto del body
    if (!mainContent) {
      mainContent = $("body").text();
    }

    // Limpiar el texto para eliminar espacios innecesarios
    return mainContent.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();
  } catch (error) {
    console.error("Error extracting text from HTML:", error);

    //Metodo de respaldo si falla
    let text = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      " "
    );
    text = text.replace(
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      " "
    );
    text = text.replace(/<[^>]+>/g, " ");
    text = text.replace(/\s+/g, " ").trim();

    return text;
  }
}
