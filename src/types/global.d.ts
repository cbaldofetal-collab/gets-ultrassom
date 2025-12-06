// Declarações de tipos globais para suporte web

declare global {
  interface Window {
    open: (url: string, target?: string) => Window | null;
  }
}

export {};


