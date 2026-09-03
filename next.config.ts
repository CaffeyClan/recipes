import type { NextConfig } from "next";

const onGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(onGitHubPages ? {
    output: "export" as const,
    basePath: "/recipes",
    assetPrefix: "/recipes/",
    images: { unoptimized: true },
    trailingSlash: true,
    typescript: { tsconfigPath: "tsconfig.pages.json" },
  } : {}),
};

export default nextConfig;
