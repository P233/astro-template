import { defineConfig } from "astro/config";
import cssnano from "cssnano";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import playformCompress from "@playform/compress";

// https://peiwen.lu/posts/hashing-collision-detectionn
let modulesConfig = { generateScopedName: "[local]-[hash:base64:4]" };
if (process.env.NODE_ENV === "production") {
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
  site: "https://your-domain.com",
  prefetch: true,
  integrations: [sitemap(), robotsTxt(), playformCompress()],
  vite: {
    css: {
      modules: modulesConfig,
      postcss: {
        plugins: [
          cssnano({ preset: ["cssnano-preset-advanced", { discardUnused: { fontFace: false } }] })
        ]
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
