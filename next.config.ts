import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-stylesheets",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 604800,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 31536e3,
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-images",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 86400,
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 86400,
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\/api\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/webp", "image/avif"],
  },
  // Ignorar errores de TypeScript durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorar errores de ESLint durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPWA(nextConfig);