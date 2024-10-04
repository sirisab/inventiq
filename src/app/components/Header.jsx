"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth";

function Header() {
  const auth = useAuth();

  // Lägg till en logg för att verifiera att auth.logout är tillgänglig
  console.log("Auth object:", auth);

  return (
    <div className="header">
      <div className="logo">InventIQ</div>
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
