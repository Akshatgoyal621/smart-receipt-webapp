import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-600 mt-10">
      {/* Brand */}
      <div className="mb-3 text-base font-medium tracking-wide text-brand-600">
        Smart Receipts • Track. Organize. Simplify.
      </div>

      {/* Links */}
      <div className="flex justify-center gap-6 mt-4 text-slate-500">
        <a
          href="https://www.linkedin.com/in/akshatgoyal1105"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-brand-600"
        >
          LinkedIn
        </a>

        <a
          href="https://github.com/AkshatGoyal621"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-brand-600"
        >
          GitHub 
        </a>

        <a
          href="https://akshats-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-brand-600"
        >
          Portfolio
        </a>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-xs text-slate-400">
        © {year}{" "}
        <span className="font-medium text-slate-600">Akshat Goyal</span>. All
        rights reserved.
      </div>
    </footer>
  );
}
