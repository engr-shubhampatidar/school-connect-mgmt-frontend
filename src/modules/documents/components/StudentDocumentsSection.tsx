"use client";

import React from "react";
import { Trash2, Upload } from "lucide-react";
import FormSectionCard from "@/modules/students/components/student-form/FormSectionCard";
import type { StudentDocument, UploadingDoc } from "../types";

type Props = {
  documents: StudentDocument[];
  uploading: UploadingDoc[];
  onUpload: (files: FileList | null) => void;
  onRemove: (url: string) => void;
};

export default function StudentDocumentsSection({
  documents,
  uploading,
  onUpload,
  onRemove,
}: Props) {
  return (
    <FormSectionCard title="Student Documents (Optional)">
      <div className="md:col-span-2">
        <div
          onDrop={(e) => {
            e.preventDefault();
            onUpload(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#C5D6F5] bg-[#F9FBFF] px-6 py-8 text-center"
        >
          <Upload className="h-5 w-5 text-[#64748B]" />
          <p className="mt-2 text-sm text-[#64748B]">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-[#94A3B8]">
            PDF, JPG, or PNG (Max size: 5MB)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,image/png,image/jpeg"
            className="mt-3 text-sm"
            onChange={(e) => onUpload(e.target.files)}
          />
        </div>
      </div>

      <div className="md:col-span-2 space-y-3">
        {documents.length === 0 && uploading.length === 0 ? (
          <p className="text-sm text-slate-500">No documents uploaded.</p>
        ) : null}

        {documents.map((doc) => (
          <div
            key={doc.url}
            className="flex items-center justify-between rounded-md border border-[#D7E3FC] bg-white px-3 py-2"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#0F172A]">
                {doc.document_type}
              </span>
              <span className="text-xs text-[#64748B] truncate">{doc.url}</span>
            </div>
            <button
              type="button"
              className="text-[#E11D48] hover:text-red-700"
              onClick={() => onRemove(doc.url)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {uploading.map((doc, idx) => (
          <div
            key={`${doc.name}-${idx}`}
            className="flex items-center justify-between rounded-md border border-dashed border-[#D7E3FC] bg-slate-50 px-3 py-2 text-sm"
          >
            <span className="text-[#0F172A]">{doc.name}</span>
            <span className="text-xs text-slate-500">
              {doc.status === "uploading" ? "Uploading..." : doc.error}
            </span>
          </div>
        ))}
      </div>
    </FormSectionCard>
  );
}
