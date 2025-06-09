import { z } from "zod";

// Esquema de validación para la respuesta de Exa
const exaSearchResultSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  text: z.string().optional(),
  content: z.string().optional(),
  published: z.string().optional(),
  author: z.string().nullable(),
  score: z.number().optional().default(0),
  highlights: z
    .array(z.object({ text: z.string(), score: z.number().optional() }))
    .optional(),
});

export type ExaSearchResult = z.infer<typeof exaSearchResultSchema>;

const exaSearchResponseSchema = z.object({
  results: z.array(exaSearchResultSchema),
  next: z.string().optional(),
});

export type ExaSearchResponse = z.infer<typeof exaSearchResponseSchema>;

interface ExaSearchOptions {
  query: string;
  numResults?: number;
  useAutoprompt?: boolean;
  highlightResults?: boolean;
  highlightSelector?: string;
  startCursor?: string;
  contents?: {
    text?: boolean;
  };
}

// Cliente para la API de Exa

export class ExaClient {
  private apiKey: string;
  private baseUrl = "https://api.exa.ai/search";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = apiKey;
  }

  // Método para realizar una búsqueda
  async search({
    query,
    numResults = 10,
    useAutoprompt = true,
    highlightResults = true,
    highlightSelector = "text",
    startCursor,
    contents = { text: true },
  }: ExaSearchOptions): Promise<ExaSearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          numResults,
          useAutoprompt,
          highlightResults,
          highlightSelector,
          cursor: startCursor,
          contents,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Exa API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return exaSearchResponseSchema.parse(data);
    } catch (error) {
      console.error("Error searching with Exa", error);

      throw new Error(
        `Failed to search with Exa: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Realizar una busqueda paginada hasta obtener el numero deseado de resultados
  async searchAll(
    options: ExaSearchOptions,
    maxResults = 30
  ): Promise<ExaSearchResult[]> {
    let allResults: ExaSearchResult[] = [];
    let nextCursor: string | undefined = options.startCursor;

    try {
      while (allResults.length < maxResults) {
        const searchOptions = { ...options };
        if (nextCursor) {
          searchOptions.startCursor = nextCursor;
        }

        const response = await this.search(searchOptions);
        allResults = [...allResults, ...response.results];

        // Si no hay mas resultados o no hay cursor para la siguiente pagina, salir del bucle
        if (!response.next || !response.results.length) {
          break;
        }

        nextCursor = response.next;
      }

      //Limitar al numero maximo de resultados
      return allResults.slice(0, maxResults);
    } catch (error) {
      console.error("Error fetching all search results:", error);
      throw new Error(
        `Failed to fetch all search results: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

// Funcion para obtener una instancia de ExaClient
let exaClientInstance: ExaClient | null = null;

export function getExaClient(): ExaClient {
  if (!exaClientInstance) {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      throw new Error("EXA_API_KEY is not set");
    }
    exaClientInstance = new ExaClient(apiKey);
  }
  return exaClientInstance;
}

// Funcion para realizar busquedas con Exa
export async function searchExa(
  query: string,
  numResults = 10
): Promise<ExaSearchResult[]> {
  try {
    const client = getExaClient();
    const results = await client.searchAll(
      { query, numResults, useAutoprompt: true, highlightResults: true },
      numResults
    );
    return results;
  } catch (error) {
    console.log("Error searching with Exa", error);

    //Si hay un error con la API, devolvemos resultados simulados para desarrollo
    if (process.env.NODE_ENV === "development") {
      console.warn("Using simulated results for development");
      return generateSimulatedResults(query, numResults);
    }

    throw error;
  }
}

// Funcion para generar resultados simulados para desarrollo
function generateSimulatedResults(
  query: string,
  count: number
): ExaSearchResult[] {
  const baseResults = [
    {
      id: "1",
      title: `Últimos avances en ${query}`,
      url: `https://example.com/advances-in-${encodeURIComponent(query)}`,
      text: `Este artículo explora los últimos avances en ${query}, destacando las innovaciones más recientes y su impacto en la sociedad actual. Los investigadores han descubierto nuevas formas de abordar los desafíos en este campo, lo que promete revolucionar nuestra comprensión y aplicación de estas tecnologías en el futuro próximo.`,
    },
    {
      id: "2",
      title: `Estudio comparativo sobre ${query}`,
      url: `https://research.org/comparative-study-${encodeURIComponent(
        query
      )}`,
      text: `Un análisis exhaustivo que compara diferentes enfoques y metodologías relacionadas con ${query}. Este estudio proporciona datos cuantitativos y cualitativos que ayudan a entender las ventajas y desventajas de cada enfoque, ofreciendo una visión completa del estado actual de la investigación en este campo.`,
    },
    {
      id: "3",
      title: `El futuro de ${query}: tendencias y predicciones`,
      url: `https://futurism.com/trends-${encodeURIComponent(query)}`,
      text: `Expertos en el campo analizan las tendencias actuales y hacen predicciones sobre el futuro de ${query}. El artículo incluye entrevistas con líderes de la industria y académicos destacados, proporcionando una visión multifacética de hacia dónde se dirige este campo en los próximos años.`,
    },
    // Más resultados simulados...
  ];

  //Asegurarse de que el numero de resultados simulados es suficiente
  const results: ExaSearchResult[] = [];
  for (let i = 0; i < count; i++) {
    const baseIndex = i % baseResults.length;
    const result = { ...baseResults[baseIndex] };

    // Añadir un poco de variacion para resultados duplicados
    if (i >= baseResults.length) {
      result.title = `[Actualizado] ${result.title}`;
      result.url = result.url.replace("https://", "https://updated.");
      result.id = `${result.id}-${Math.floor(i / baseResults.length)}`;
    }
    results.push(result as ExaSearchResult);
  }
  return results;
}
