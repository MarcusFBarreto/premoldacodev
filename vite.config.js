// vite.config.js - VERSÃO FINAL E CORRETA
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Define a pasta 'src' como a raiz do nosso site para o Vite
  root: 'src',

  build: {
    // Define o diretório de saída como 'dist' na raiz do projeto
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      // Especifica todos os arquivos HTML como pontos de entrada
      input: {
        main: resolve(__dirname, 'src/index.html'),
        calculadora: resolve(__dirname, 'src/calculadora.html'),
        pushin: resolve(__dirname, 'src/pushin.html'), // <-- ADICIONE ESTA LINHA
        404: resolve(__dirname, 'src/404.html'),
      },
    },
  },
});