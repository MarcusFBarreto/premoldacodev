// vite.config.js - VERSÃO CORRIGIDA E FINAL
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Define a pasta 'src' como a raiz do nosso site para o Vite
  root: 'src',

  // Diz ao Vite que a pasta public está um nível ACIMA da raiz 'src'
  publicDir: '../public',

  build: {
    // Define o diretório de saída como 'dist' na raiz do projeto
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      // Especifica todos os arquivos HTML como pontos de entrada
      input: {
        main: resolve(__dirname, 'src/index.html'),
        calculadora: resolve(__dirname, 'src/calculadora.html'),
        pushin: resolve(__dirname, 'src/pushin.html'),
        admin: resolve(__dirname, 'src/admin.html'),
        '404': resolve(__dirname, 'src/404.html'), // Corrigido para ser uma string válida
      },
    },
  },
});