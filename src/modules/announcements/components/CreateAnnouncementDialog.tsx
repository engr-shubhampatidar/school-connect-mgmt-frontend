"use client";

import React, { FC, useState, useEffect } from "react";
import {
  createAnnouncement,
  type CreateAnnouncementAttachment,
} from "@/modules/announcements/api/announcements";

interface CreateAnnouncementDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (announcement: unknown) => void;
}

const modalBackdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const dialogStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 6,
  width: "90%",
  maxWidth: 640,
  padding: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  maxHeight: "90vh",
  overflowY: "auto",
};

const CreateAnnouncementDialog: FC<CreateAnnouncementDialogProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");
  const [attachments, setAttachments] = useState<CreateAnnouncementAttachment[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    title: false,
    message: false,
    audience: false,
  });

  useEffect(() => {
    if (!open) {
      setTitle("");
      setMessage("");
      setAudience("");
      setAttachments([]);
      setLoading(false);
      setServerError(null);
      setTouched({ title: false, message: false, audience: false });
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    return {
      title: title.trim() === "",
      message: message.trim() === "",
      audience: audience.trim() === "",
    };
  };

  const errors = validate();
  const formInvalid = errors.title || errors.message || errors.audience;

  const setAttachmentField = (
    index: number,
    key: keyof CreateAnnouncementAttachment,
    value: string,
  ) => {
    setAttachments((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [key]: value } : a)),
    );
  };

  const addAttachment = () =>
    setAttachments((prev) => [...prev, { filename: "", url: "" }]);

  const removeAttachment = (index: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched({ title: true, message: true, audience: true });
    setServerError(null);

    if (formInvalid) return;

    setLoading(true);
    try {
      const body = {
        title: title.trim(),
        message: message.trim(),
        audience: audience.trim(),
        attachments: attachments.map((a) => ({
          filename: a.filename,
          url: a.url,
        })),
      };

      try {
        const json = await createAnnouncement(body);
        if (onCreated) onCreated(json);
        setLoading(false);
        onClose();
        return;
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message?: string }; status?: number };
          message?: string;
        };
        if (axiosErr && axiosErr.response) {
          const errData = axiosErr.response.data;
          const errMsg =
            errData?.message || `Server returned ${axiosErr.response.status}`;
          setServerError(errMsg);
          setLoading(false);
          return;
        }
        setServerError(axiosErr?.message || "Network error");
        setLoading(false);
        return;
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Network error";
      setServerError(message);
      setLoading(false);
    }
  };

  return (
    <div
      style={modalBackdropStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Create announcement dialog"
    >
      <div style={{ ...dialogStyle, width: "90%", maxWidth: 720, padding: 20 }}>
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>

          <div style={{ marginBottom: 6 }}>
            <h2 style={{ margin: 0, fontSize: 20, color: "#021034" }}>
              Create New Announcement
            </h2>
            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              Share important updates with your community
            </p>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="announcement-title"
                style={{ fontSize: 13, fontWeight: 600, color: "#021034" }}
              >
                Announcement Title
              </label>
              <input
                id="announcement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                style={{
                  width: "100%",
                  padding: 10,
                  fontSize: 14,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                aria-invalid={touched.title && errors.title}
                aria-required
              />
              {touched.title && errors.title && (
                <div style={{ color: "#b00020", fontSize: 13 }}>
                  Title is required.
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="announcement-message"
                style={{ fontSize: 13, fontWeight: 600, color: "#021034" }}
              >
                Message Content
              </label>
              <textarea
                id="announcement-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                rows={6}
                style={{
                  width: "100%",
                  padding: 10,
                  fontSize: 14,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  minHeight: 100,
                }}
                aria-invalid={touched.message && errors.message}
                aria-required
              />
              {touched.message && errors.message && (
                <div style={{ color: "#b00020", fontSize: 13 }}>
                  Message is required.
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                htmlFor="announcement-audience"
                style={{ fontSize: 13, fontWeight: 600, color: "#021034" }}
              >
                Target Audience
              </label>
              <select
                id="announcement-audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, audience: true }))}
                style={{
                  width: "100%",
                  padding: 10,
                  fontSize: 14,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                aria-invalid={touched.audience && errors.audience}
                aria-required
              >
                <option value="">Select audience</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
                <option value="all">All</option>
              </select>
              {touched.audience && errors.audience && (
                <div style={{ color: "#b00020", fontSize: 13 }}>
                  Audience is required.
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#021034" }}
              >
                Attachments
              </label>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderRadius: 10,
                  border: "2px dashed #bfdbfe",
                  background: "#eff6ff",
                  padding: 20,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 28, color: "#1e3a8a" }}>⬆</div>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}
                >
                  Drag & Drop To Upload
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 20MB)
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: attachments.length === 0 ? "#6b7280" : "#0f172a",
                  }}
                >
                  {attachments.length === 0
                    ? "No attachments"
                    : `${attachments.length} attachment(s)`}
                </div>
                <button
                  type="button"
                  onClick={addAttachment}
                  style={{
                    padding: "6px 10px",
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        htmlFor={`att-filename-${idx}`}
                        style={{ fontSize: 12 }}
                      >
                        Filename
                      </label>
                      <input
                        id={`att-filename-${idx}`}
                        value={att.filename}
                        onChange={(e) =>
                          setAttachmentField(idx, "filename", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: 8,
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label
                        htmlFor={`att-url-${idx}`}
                        style={{ fontSize: 12 }}
                      >
                        URL
                      </label>
                      <input
                        id={`att-url-${idx}`}
                        value={att.url}
                        onChange={(e) =>
                          setAttachmentField(idx, "url", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: 8,
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        aria-label={`Remove attachment ${idx}`}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 6,
                          background: "#f3f4f6",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {serverError && (
            <div style={{ color: "#b00020", marginTop: 12 }}>{serverError}</div>
          )}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "transparent",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formInvalid}
              aria-disabled={loading || formInvalid}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#021034",
                color: "white",
                cursor: loading || formInvalid ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementDialog;
