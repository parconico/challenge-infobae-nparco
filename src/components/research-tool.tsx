"use client";

import { initialResearch } from "@/app/actions/research-actions";
import ArticleGenerator from "@/components/article-generator";
import ResearchResults from "@/components/research-results";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useActiveTab,
  useArticleState,
  useResearchActions,
  useResearchState,
  useUiActions,
} from "@/lib/store";

const PREDEFINED_TOPICS = [
  "Inteligencia Artificial en la educación",
  "Cambio climático y energías renovables",
  "Avances en medicina regenerativa",
  "El futuro del trabajo remoto",
  "Blockchain y criptomonedas",
  "Realidad virtual y aumentada",
];

export default function ResearchTool() {
  const research = useResearchState();
  const article = useArticleState();
  const activeTab = useActiveTab();

  const { setResearchResults, setResearchLoading, setCurrentTopic } =
    useResearchActions();
  const { setActiveTab } = useUiActions();

  const handleResearch = async (topic: string) => {
    setResearchLoading(true);
    setCurrentTopic(topic);
    try {
      const researchResults = await initialResearch(topic);
      setResearchResults(researchResults);
    } catch (error) {
      console.error("Error en la investigación:", error);
    } finally {
      setResearchLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="research">Investigación</TabsTrigger>
          <TabsTrigger value="article" disabled={!article.selectedResult}>
            Generación de Articulo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-6">
          <Card className="p-6">
            <h2>Selecciona un tema para investigar</h2>
            {research.currentTopic && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">
                  <strong>Tema actual:</strong> {research.currentTopic}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PREDEFINED_TOPICS.map((topic) => (
                <Button
                  key={topic}
                  variant={
                    research.currentTopic === topic ? "default" : "outline"
                  }
                  onClick={() => handleResearch(topic)}
                  className="h-auto py-3 justify-start text-left"
                  disabled={research.isLoading}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </Card>

          {research.isLoading ? (
            <div className="flex flex-col justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">
                Investigando {research.currentTopic}...
              </p>
            </div>
          ) : research.results.length > 0 ? (
            <ResearchResults />
          ) : null}
        </TabsContent>

        <TabsContent value="article">
          {article.selectedResult && <ArticleGenerator />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
