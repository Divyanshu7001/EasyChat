/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["easychat-3iur.onrender.com"], 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "easychat-3iur.onrender.com",
        port: "", 
        pathname: "/uploads/images/**", 
      },
    ],
  },
};

module.exports = nextConfig;
