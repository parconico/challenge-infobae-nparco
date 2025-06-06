import ResearchTool from "@/components/research-tool";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Herramienta de Investigación
          </h1>
          <p className="text-lg text-muted-foreground">
            Utiliza IA para investigar temas, categorizar resultados y generar
            artículos de calidad
          </p>
        </header>
        <ResearchTool />
      </div>
    </main>
  );
}
