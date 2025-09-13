import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for webpack module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ensure '@/' alias resolves to project root in all environments (Linux/macOS/Windows)
    // This mirrors the tsconfig "paths" mapping and prevents case-sensitive FS issues on Vercel
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(process.cwd()),
    };

    // Fix for undici private field syntax - more targeted approach
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                node: '18'
              }
            }]
          ],
          plugins: [
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-proposal-class-properties'
          ]
        }
      }
    });

    // Mark undici as external for server-side builds to avoid parsing issues
    if (isServer) {
      config.externals = [...(config.externals || []), 'undici'];
    }
    
    return config;
  },
}

export default nextConfig
