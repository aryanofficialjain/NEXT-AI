"use client";

import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";

import { User } from "next-auth";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 shadow-md md:p-6">
      <div className="conatiner mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#">Mystery Message</a>
        {session ? (
          <>
            <span className="text-xl">Welcome {user.username}</span>
            <button onClick={() => signOut()} className="w-full md:w-auto">Logout</button>
          </>
        ) : (
          <>
            <Link href="/sign-in">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
