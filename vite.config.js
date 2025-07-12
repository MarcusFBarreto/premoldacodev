
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Define src como root virtual
  base: '/', // Base path for deployment
  envDir: '../', // Se .env estiver na raiz (fora de src)
  plugins: [], // Add plugins, ex.: for Firebase
  build: {
    outDir: '../dist', // Output na raiz
    emptyOutDir: true, // Limpa dist auto
    target: 'esnext', // Modern JS (do indicado)
    minify: 'esbuild', // Minify rápido (do indicado)
    sourcemap: false, // Sem maps em prod (do indicado)
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        calculadora: resolve(__dirname, 'src/calculadora.html'),
        pushin: resolve(__dirname, 'src/pushin.html'),
        admin: resolve(__dirname, 'src/admin.html'),
        '404': resolve(__dirname, 'src/404.html'),
      },
      output: {
        entryFileNames: '[name].js', // Custom names (do indicado)
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  server: {
    open: true, // Abre browser em dev (do indicado)
    port: 3000, // Port dev (do indicado)
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para imports (do indicado)
    },
  },
});


/*

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
        admin: resolve(__dirname, 'src/admin.html'), // <-- ADICIONE ESTA LINHA
        404: resolve(__dirname, 'src/404.html'),
      },
    },
  },
});



*/