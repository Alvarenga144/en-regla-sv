import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://en-regla.sv",
  trailingSlash: "always",
  integrations: [sitemap()],
});
