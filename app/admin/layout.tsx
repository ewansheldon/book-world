import Link from "next/link";
import { signOut } from "@/auth";
import "./styles/admin.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="admin-nav-links">
          <Link href="/">Bookworld Map</Link>
          <span>|</span>
          <Link href="/admin">Admin Home</Link>
          <span>|</span>
          <Link href="/admin/books/create">New book</Link>
          <span>|</span>
          <Link href="/admin/books/without-description">Missing descriptions</Link>
          <span>|</span>
          <Link href="/admin/books/without-tags">Missing tags</Link>
        </div>
        <form action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}>
          <button type="submit" className="admin-nav-sign-out">Sign out</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
