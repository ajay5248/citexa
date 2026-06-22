import type { NextConfig } from "next";

const nextConfig: any = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/:path*' : 'https://citexa.onrender.com/:path*', // Proxy to Backend
      },
    ];
  }
};

export default nextConfig;
