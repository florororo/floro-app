import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from 'next';


const withNextIntl = createNextIntlPlugin();


const nextConfig: NextConfig = {
    // Your existing Next.js config options
    reactStrictMode: true,
    
    // NEW: Turbopack configuration (replaces experimental.turbo)
    turbopack: {
      // You can define custom rules for file transformations (like SVGR)
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      // You can also add resolve aliases
      resolveAlias: {
        '@components': './src/components',
      },
    },
  };

   
export default withNextIntl(nextConfig);