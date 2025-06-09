import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanSnippet(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, "") // quitar URLs
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "") // quitar caracteres no estándar (emojis, símbolos raros)
    .replace(/[\[\]{}()*_~^<>|\\]/g, "") // quitar caracteres especiales comunes
    .replace(/\s+/g, " ") // colapsar múltiples espacios
    .trim();
}
