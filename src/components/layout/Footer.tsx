import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-slate-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} SchoolConnect — All rights reserved.
          </div>
          <div className="flex gap-4 text-slate-500">
            <a href="#privacy" className="hover:text-slate-700">
              Privacy
            </a>
            <a href="#terms" className="hover:text-slate-700">
              Terms
            </a>
            <a href="#support" className="hover:text-slate-700">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
