/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icon-library.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      }  ,
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.freepik.com',
      },   
      {
        protocol: 'https',
        hostname: 'chatfinity.s3.ap-south-1.amazonaws.com',
      },

    ],

  },

};

export default nextConfig;
