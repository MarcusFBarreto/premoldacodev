// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Diga ao Vite que a raiz do seu projeto é a pasta 'src'.
  root: 'src',

  build: {
    // Diga ao Vite para colocar o resultado do build na pasta 'dist' na raiz do projeto.
    outDir: '../dist',
    // Limpa o diretório de build antes de compilar.
    // para permiir novo deploy - desconsiderar
    emptyOutDir: true,
  },
});