"use client";

import { initialResearch } from "@/app/actions/research-actions";
import ArticleGenerator from "@/components/article-generator";
import ResearchResults from "@/components/research-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useActiveTab,
  useArticleState,
  useResearchActions,
  useResearchState,
  useUiActions,
} from "@/lib/store";
import { TopicSelector } from "./research/TopicSelector";
import { useStorageCleanup } from "@/hooks/useStoreCleanup";

const PREDEFINED_TOPICS = [
  "Inteligencia Artificial en la educación",
  "Cambio climático y energías renovables",
  "Avances en medicina regenerativa",
  "El futuro del trabajo remoto",
  "Blockchain y criptomonedas",
  "Realidad virtual y aumentada",
];

export default function ResearchTool() {
  useStorageCleanup();
  const research = useResearchState();
  const article = useArticleState();
  const activeTab = useActiveTab();

  const { setResearchResults, setResearchLoading, setCurrentTopic } =
    useResearchActions();
  const { setActiveTab } = useUiActions();
  const { resetAll } = useUiActions();

  const handleResearch = async (topic: string) => {
    // Primero limpiamos todo el estado
    resetAll();

    // Luego iniciamos la nueva búsqueda
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
          <TopicSelector
            topics={PREDEFINED_TOPICS}
            onTopicSelect={handleResearch}
            isLoading={research.isLoading}
          />

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
