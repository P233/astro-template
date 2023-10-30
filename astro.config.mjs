import { defineConfig } from "astro/config";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import robotsTxt from "astro-robots-txt";
import autoprefixer from "autoprefixer";

let modulesConfig = {
  generateScopedName: "[local]-[hash:base64:4]"
};

if (process.env.IS_PROD) {
  const fileSet = {};
  const hashSet = {};
  modulesConfig = {
    getJSON: function (file, json) {
      if (fileSet[file]) return;

      fileSet[file] = true;
      Object.values(json).forEach((i) => {
        if (hashSet[i]) throw Error("HASH COLLISION ERROR");
        hashSet[i] = true;
      });
    },
    generateScopedName: "[hash:base64:2]"
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    prefetch({
      selector: "a[href^='/']"
    }),
    sitemap(),
    robotsTxt(),
    compress()
  ],
  vite: {
    css: {
      modules: modulesConfig,
      postcss: {
        plugins: [autoprefixer()]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/_common" as *;`
        }
      }
    },
    resolve: {
      alias: [{ find: "~", replacement: "/src/" }]
    }
  }
});
