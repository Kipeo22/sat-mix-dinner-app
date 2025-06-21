import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      {" "}
      {/* classNameを変更 */}
      <Link href="/">ユーザー</Link>
      <Link href="/stores">お店</Link>
      <Link href="/results">投票結果</Link>
    </nav>
  );
}
