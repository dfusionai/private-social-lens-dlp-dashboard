import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  // Enable Svelte 5 runes mode
  compilerOptions: {
    runes: true,
  },

  // Preprocess TypeScript, PostCSS, etc.
  preprocess: vitePreprocess(),

  // Enable source maps for debugging
  sourcemap: true,

  // Enable CSS extraction
  css: true,

  // Enable SSR if needed
  ssr: false,

  // Enable dev tools
  devtools: true,
};

export default config;
