import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // относительные пути: сайт работает и в подпапке GitHub Pages (/-HTML-CSS/)
  base: './',
  css: {
    modules: {
      // имена классов в сборке: Компонент_класс_хеш — удобно искать в DevTools
      generateScopedName: '[name]_[local]_[hash:base64:5]'
    }
  }
});
