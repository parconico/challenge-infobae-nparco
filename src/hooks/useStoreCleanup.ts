"use client";

import { useEffect } from "react";

export function useStorageCleanup() {
  useEffect(() => {
    // Función para limpiar el localStorage
    const clearStorageOnReload = () => {
      // Verificar si es una recarga de página (no navegación)
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        localStorage.removeItem("research-tool-store");
      }
    };

    // Limpiar cuando se cierra/recarga la página
    const handleBeforeUnload = () => {
      localStorage.removeItem("research-tool-store");
    };

    // Agregar event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Limpiar al montar el componente si fue una recarga
    clearStorageOnReload();

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
