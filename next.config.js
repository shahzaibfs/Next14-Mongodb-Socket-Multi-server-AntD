await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    typedRoutes: true,
  },
};

export default config;
