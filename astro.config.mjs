import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://en-regla-sv.vercel.app",
  trailingSlash: "always",
  integrations: [sitemap()],
});
