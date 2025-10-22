/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "395z4m7f-8080.asse.devtunnels.ms",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
