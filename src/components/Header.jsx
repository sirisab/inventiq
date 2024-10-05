"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth";

function Header() {
  const auth = useAuth();

  return (
    <div className="header">
      <div className="logo">
        InventIQ <Link href="../items">Items</Link>
      </div>
      <div className="logout">
        {auth.token ? (
          <Link href="../" onClick={auth.logout}>
            Logout
          </Link>
        ) : (
          <Link href="../" onClick={auth.login}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
