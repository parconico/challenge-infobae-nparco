import { useResearchState } from "@/lib/store";
import jsPDF from "jspdf";

export const useExportResults = () => {
  const { worthExpandingResults, notWorthExpandingResults } =
    useResearchState();

  const handleExportJSON = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        summary: {
          totalResults:
            worthExpandingResults.length + notWorthExpandingResults.length,
          worthExpanding: worthExpandingResults.length,
          notWorthExpanding: notWorthExpandingResults.length,
        },
        results: {
          worthExpanding: worthExpandingResults,
          notWorthExpanding: notWorthExpandingResults,
        },
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `research-results-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("JSON exportado exitosamente");
    } catch (error) {
      console.error("Error al exportar JSON:", error);
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const lineHeight = 7;
      const maxWidth = pageWidth - margin * 2; // Ancho máximo del texto

      // Función para agregar nueva página si es necesario
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Función para dividir texto largo con ancho correcto
      const splitText = (text: string) => {
        return doc.splitTextToSize(text, maxWidth);
      };

      // Título principal
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Resultados de Investigación", margin, yPosition);
      yPosition += 15;

      // Fecha de exportación
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Fecha de exportación: ${new Date().toLocaleDateString()}`,
        margin,
        yPosition
      );
      yPosition += 10;

      // Estadísticas
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Estadísticas:", margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Total de resultados: ${
          worthExpandingResults.length + notWorthExpandingResults.length
        }`,
        margin + 10,
        yPosition
      );
      yPosition += lineHeight;
      doc.text(
        `Valen la pena expandir: ${worthExpandingResults.length}`,
        margin + 10,
        yPosition
      );
      yPosition += lineHeight;
      doc.text(
        `No valen la pena expandir: ${notWorthExpandingResults.length}`,
        margin + 10,
        yPosition
      );
      yPosition += 15;

      // Resultados que valen la pena expandir
      if (worthExpandingResults.length > 0) {
        checkNewPage(20);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("✓ Valen la pena expandir", margin, yPosition);
        yPosition += 10;

        worthExpandingResults.forEach((result, index) => {
          checkNewPage(50); // Más espacio para evitar cortes

          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          // Dividir título si es muy largo
          const titleLines = splitText(
            `${index + 1}. ${result.title || "Sin título"}`
          );
          titleLines.forEach((line: string) => {
            checkNewPage(lineHeight);
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
          });

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");

          if (result.score !== undefined) {
            doc.text(
              `Puntuación: ${result.score.toFixed(2)}`,
              margin + 5,
              yPosition
            );
            yPosition += lineHeight;
          }

          if (result.url) {
            // Dividir URL si es muy larga
            const urlLines = splitText(`URL: ${result.url}`);
            urlLines.forEach((line: string) => {
              checkNewPage(lineHeight);
              doc.text(line, margin + 5, yPosition);
              yPosition += lineHeight;
            });
          }

          if (result.snippet) {
            // Agregar texto justificado para el resumen
            const snippetText = `Resumen: ${result.snippet}`;
            const snippetLines = splitText(snippetText);

            snippetLines.forEach((line: string, lineIndex: number) => {
              checkNewPage(lineHeight);

              // Justificar texto (excepto la última línea)
              if (
                lineIndex < snippetLines.length - 1 &&
                line.trim().length > 0
              ) {
                // Contar espacios para justificación
                const words = line.trim().split(" ");
                if (words.length > 1) {
                  // Calcular espacios extras necesarios
                  const textWidth = doc.getTextWidth(line.replace(/\s+/g, " "));
                  const availableWidth = maxWidth - 5; // -5 por la indentación

                  if (textWidth < availableWidth * 0.8) {
                    // Solo justificar si no está muy lleno
                    const extraSpaces = Math.floor(
                      (availableWidth - textWidth) / doc.getTextWidth(" ")
                    );
                    const spacesPerGap = Math.floor(
                      extraSpaces / (words.length - 1)
                    );

                    if (spacesPerGap > 0) {
                      const justifiedLine = words.join(
                        " ".repeat(1 + spacesPerGap)
                      );
                      doc.text(justifiedLine, margin + 5, yPosition);
                    } else {
                      doc.text(line, margin + 5, yPosition);
                    }
                  } else {
                    doc.text(line, margin + 5, yPosition);
                  }
                } else {
                  doc.text(line, margin + 5, yPosition);
                }
              } else {
                // Última línea sin justificar
                doc.text(line, margin + 5, yPosition);
              }
              yPosition += lineHeight;
            });
          }

          //   // Agregar keywords si existen
          //   if (result.keywords && result.keywords.length > 0) {
          //     const keywordsText = `Palabras clave: ${result.keywords.join(
          //       ", "
          //     )}`;
          //     const keywordLines = splitText(keywordsText);
          //     keywordLines.forEach((line: string) => {
          //       checkNewPage(lineHeight);
          //       doc.text(line, margin + 5, yPosition);
          //       yPosition += lineHeight;
          //     });
          //   }

          yPosition += 8; // Espacio entre resultados
        });
      }

      // Resultados que no valen la pena expandir
      if (notWorthExpandingResults.length > 0) {
        checkNewPage(20);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("✗ No valen la pena expandir", margin, yPosition);
        yPosition += 10;

        notWorthExpandingResults.forEach((result, index) => {
          checkNewPage(50); // Más espacio para evitar cortes

          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          // Dividir título si es muy largo
          const titleLines = splitText(
            `${index + 1}. ${result.title || "Sin título"}`
          );
          titleLines.forEach((line: string) => {
            checkNewPage(lineHeight);
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
          });

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");

          if (result.score !== undefined) {
            doc.text(
              `Puntuación: ${result.score.toFixed(2)}`,
              margin + 5,
              yPosition
            );
            yPosition += lineHeight;
          }

          if (result.url) {
            // Dividir URL si es muy larga
            const urlLines = splitText(`URL: ${result.url}`);
            urlLines.forEach((line: string) => {
              checkNewPage(lineHeight);
              doc.text(line, margin + 5, yPosition);
              yPosition += lineHeight;
            });
          }

          if (result.snippet) {
            // Agregar texto justificado para el resumen
            const snippetText = `Resumen: ${result.snippet}`;
            const snippetLines = splitText(snippetText);

            snippetLines.forEach((line: string, lineIndex: number) => {
              checkNewPage(lineHeight);

              // Justificar texto (excepto la última línea)
              if (
                lineIndex < snippetLines.length - 1 &&
                line.trim().length > 0
              ) {
                const words = line.trim().split(" ");
                if (words.length > 1) {
                  const textWidth = doc.getTextWidth(line.replace(/\s+/g, " "));
                  const availableWidth = maxWidth - 5;

                  if (textWidth < availableWidth * 0.8) {
                    const extraSpaces = Math.floor(
                      (availableWidth - textWidth) / doc.getTextWidth(" ")
                    );
                    const spacesPerGap = Math.floor(
                      extraSpaces / (words.length - 1)
                    );

                    if (spacesPerGap > 0) {
                      const justifiedLine = words.join(
                        " ".repeat(1 + spacesPerGap)
                      );
                      doc.text(justifiedLine, margin + 5, yPosition);
                    } else {
                      doc.text(line, margin + 5, yPosition);
                    }
                  } else {
                    doc.text(line, margin + 5, yPosition);
                  }
                } else {
                  doc.text(line, margin + 5, yPosition);
                }
              } else {
                doc.text(line, margin + 5, yPosition);
              }
              yPosition += lineHeight;
            });
          }

          yPosition += 8; // Espacio entre resultados
        });
      }

      // Guardar el PDF
      doc.save(
        `resultados-investigacion-${new Date().toISOString().split("T")[0]}.pdf`
      );
      console.log("PDF exportado exitosamente");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
    }
  };

  return {
    handleExportJSON,
    handleExportPDF,
  };
};
