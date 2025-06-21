/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "litmembers.s3.amazonaws.com", // ★この行が正しく記述されていますか？
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // 例: Google Driveの画像
      },
      {
        protocol: "https",
        hostname: "i.imgur.com", // 例: Imgurの画像
      },
      // 他に使用するドメインがあればここに追加
    ],
  },
};

export default nextConfig;
