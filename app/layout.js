import Navbar from "../components/Navbar";
import "./globals.css";
import { Noto_Sans_JP } from "next/font/google"; // Google Fontsをインポート

// フォントの設定
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "お店投票アプリ",
  description: "行きたいお店に投票しよう！",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={notoSansJp.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
