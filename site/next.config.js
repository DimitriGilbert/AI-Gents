/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  basePath: process.env.NODE_ENV === 'production' ? '/AI-Gents' : '', // Replace with your repository name
  assetPrefix: process.env.NODE_ENV === 'production' ? '/AI-Gents/' : '', // Replace with your repository name

};

export default config;
