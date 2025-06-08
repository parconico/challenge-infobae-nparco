export interface ResearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
  source: string;
  worthExpanding: boolean;
  reason?: string;
}
