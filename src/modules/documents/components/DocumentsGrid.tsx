"use client";

import type { DocumentItem } from "../types";

const DEFAULT_DOCS: DocumentItem[] = [
  { id: "aadhar", title: "Aadhar Card", type: "PDF" },
  { id: "marksheet", title: "Previous Marksheet", type: "PDF" },
  { id: "birth", title: "Birth Certificate", type: "PDF" },
  { id: "tc", title: "Transfer Certificate", type: "PDF" },
];

export default function DocumentsGrid({
  title = "Uploaded Documents",
  documents = DEFAULT_DOCS,
}: {
  title?: string;
  documents?: DocumentItem[];
}) {
  return (
    <div className="w-full max-w-full bg-white rounded-xl border border-[#D7E3FC] p-[20px] mt-6">
      <h2 className="text-lg font-semibold text-[#021034] mb-4">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between border border-[#D7E3FC] rounded-lg p-4 bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#D7E3FC]"
                aria-hidden
              >
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-[#021034]">{doc.title}</p>
                {doc.type && (
                  <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-[#021034] border border-[#D7E3FC] rounded-full">
                    {doc.type}
                  </span>
                )}
              </div>
            </div>
            {doc.href ? (
              <a
                href={doc.href}
                className="flex items-center gap-2 text-[#737373] text-sm hover:text-blue-600"
              >
                <span aria-hidden>👁</span>
                <span>View</span>
              </a>
            ) : (
              <button
                type="button"
                className="flex items-center gap-2 text-[#737373] text-sm hover:text-blue-600"
              >
                <span aria-hidden>👁</span>
                <span>View</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
