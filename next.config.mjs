/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/login', destination: '/login.html' },
      { source: '/registro', destination: '/registro.html' },
      { source: '/perfil', destination: '/perfil.html' },
      { source: '/foro', destination: '/foro.html' },
    ];
  },
};

export default nextConfig;
