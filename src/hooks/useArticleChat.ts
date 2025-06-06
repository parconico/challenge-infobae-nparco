"use client";

import type React from "react";

import { useChat } from "ai/react";
import { useArticleActions, useArticleState } from "@/lib/store";

export function useArticleChat() {
  const { setReinterpretedArticle } = useArticleActions();
  const { initialArticle } = useArticleState();

  const chat = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      setReinterpretedArticle(message.content);
    },
  });

  const reinterpretArticle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!chat.input.trim() || !initialArticle) {
      return;
    }

    // Crear el mensaje con el contexto del artículo
    const messageWithContext = `
Artículo original:
${initialArticle}

Instrucciones para reinterpretar:
${chat.input}

Por favor, reinterpreta el artículo siguiendo las instrucciones proporcionadas. Mantén la estructura y información principal, pero aplica los cambios solicitados.
    `;

    // Enviar el mensaje con contexto
    chat.append({
      role: "user",
      content: messageWithContext,
    });

    // Limpiar el input
    chat.setInput("");
  };

  return {
    ...chat,
    reinterpretArticle,
    hasArticle: !!initialArticle,
  };
}
