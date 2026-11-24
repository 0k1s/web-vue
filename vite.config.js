import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [vue(), tailwindcss()], // vue() учит Vite понимать .vue-файлы, tailwindcss() собирает CSS
  base: './', // относительные пути: собранный сайт работает из любой папки
});
