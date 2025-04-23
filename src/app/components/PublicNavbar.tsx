"use client";
import React from 'react';
import Link from 'next/link';

export default function PublicNavbar() {
  return (
    <nav className="bg-gradient-to-r from-yellow-400 to-black dark:from-yellow-500 dark:to-black p-4">
      <div className="w-full mx-auto flex justify-between items-center">
        <Link href="/" className="font-mono text-white text-2xl font-bold">
          CCCA-BTP
        </Link>
      </div>
    </nav>
  );
} 