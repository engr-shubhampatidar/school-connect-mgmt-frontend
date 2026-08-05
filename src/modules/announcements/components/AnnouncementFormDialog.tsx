"use client";

import React, { FC, useEffect, useState } from "react";
import {
  createAnnouncement,
  updateAnnouncement,
  type Announcement,
  type AnnouncementScope,
  type CreateAnnouncementAttachment,
} from "@/modules/announcements/api/announcements";
import { fetchClasses, type ClassItem } from "@/modules/classes";

interface AnnouncementFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved?: (announcement: Announcement) => void;
  announcement?: Announcement | null;
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
  position: "relative",
  background: "#fff",
  borderRadius: 6,
  width: "90%",
  maxWidth: 720,
  padding: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  maxHeight: "90vh",
  overflowY: "auto",
};

const AnnouncementFormDialog: FC<AnnouncementFormDialogProps> = ({
  open,
  onClose,
  onSaved,
  announcement = null,
}) => {
  const isEdit = Boolean(announcement?.id);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<AnnouncementScope | "">("");
  const [targetClassId, setTargetClassId] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [attachments, setAttachments] = useState<CreateAnnouncementAttachment[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    title: false,
    message: false,
    scope: false,
    targetClassId: false,
  });

  useEffect(() => {
    if (!open) return;

    if (announcement) {
      setTitle(announcement.title ?? "");
      setMessage(announcement.message ?? "");
      setScope(announcement.scope ?? "SCHOOL");
      setTargetClassId(announcement.targetClassId ?? "");
      setAttachments(announcement.attachments ?? []);
    } else {
      setTitle("");
      setMessage("");
      setScope("");
      setTargetClassId("");
      setAttachments([]);
    }

    setLoading(false);
    setServerError(null);
    setTouched({
      title: false,
      message: false,
      scope: false,
      targetClassId: false,
    });
  }, [open, announcement]);

  useEffect(() => {
    if (!open) return;

    let mounted = true;
    setClassesLoading(true);
    fetchClasses({ page: 1, pageSize: 100 })
      .then((res) => {
        if (!mounted) return;
        setClasses(res.classes ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setClasses([]);
      })
      .finally(() => {
        if (mounted) setClassesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [open]);

  if (!open) return null;

  const validate = () => ({
    title: title.trim() === "",
    message: message.trim() === "",
    scope: scope === "",
    targetClassId: scope === "CLASS" && targetClassId.trim() === "",
  });

  const errors = validate();
  const formInvalid =
    errors.title || errors.message || errors.scope || errors.targetClassId;

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
    setTouched({
      title: true,
      message: true,
      scope: true,
      targetClassId: true,
    });
    setServerError(null);

    if (formInvalid || !scope) return;

    setLoading(true);
    try {
      const cleanedAttachments = attachments
        .filter((a) => a.filename.trim() || a.url.trim())
        .map((a) => ({
          filename: a.filename.trim(),
          url: a.url.trim(),
        }));

      const body = {
        title: title.trim(),
        message: message.trim(),
        scope,
        ...(scope === "CLASS" ? { targetClassId: targetClassId.trim() } : {}),
        ...(cleanedAttachments.length > 0
          ? { attachments: cleanedAttachments }
          : isEdit
            ? { attachments: [] }
            : {}),
      };

      const saved = isEdit
        ? await updateAnnouncement(announcement!.id, body)
        : await createAnnouncement(body);

      onSaved?.(saved);
      setLoading(false);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string | string[] }; status?: number };
        message?: string;
      };
      const errData = axiosErr?.response?.data?.message;
      const errMsg = Array.isArray(errData)
        ? errData.join(", ")
        : errData ||
          (axiosErr?.response?.status
            ? `Server returned ${axiosErr.response.status}`
            : axiosErr?.message || "Network error");
      setServerError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div
      style={modalBackdropStyle}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit announcement dialog" : "Create announcement dialog"}
    >
      <div style={dialogStyle}>
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
              {isEdit ? "Edit Announcement" : "Create New Announcement"}
            </h2>
            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              Share important updates with your school community
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
                htmlFor="announcement-scope"
                style={{ fontSize: 13, fontWeight: 600, color: "#021034" }}
              >
                Scope
              </label>
              <select
                id="announcement-scope"
                value={scope}
                onChange={(e) => {
                  const next = e.target.value as AnnouncementScope | "";
                  setScope(next);
                  if (next !== "CLASS") setTargetClassId("");
                }}
                onBlur={() => setTouched((t) => ({ ...t, scope: true }))}
                style={{
                  width: "100%",
                  padding: 10,
                  fontSize: 14,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                aria-invalid={touched.scope && errors.scope}
                aria-required
              >
                <option value="">Select scope</option>
                <option value="SCHOOL">School-wide</option>
                <option value="CLASS">Specific class</option>
              </select>
              {touched.scope && errors.scope && (
                <div style={{ color: "#b00020", fontSize: 13 }}>
                  Scope is required.
                </div>
              )}
            </div>

            {scope === "CLASS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="announcement-class"
                  style={{ fontSize: 13, fontWeight: 600, color: "#021034" }}
                >
                  Target Class
                </label>
                <select
                  id="announcement-class"
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, targetClassId: true }))
                  }
                  disabled={classesLoading}
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 14,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                  aria-invalid={touched.targetClassId && errors.targetClassId}
                  aria-required
                >
                  <option value="">
                    {classesLoading ? "Loading classes..." : "Select class"}
                  </option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                      {cls.section ? ` - ${cls.section}` : ""}
                    </option>
                  ))}
                </select>
                {touched.targetClassId && errors.targetClassId && (
                  <div style={{ color: "#b00020", fontSize: 13 }}>
                    Class is required for class-scoped announcements.
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#021034" }}
              >
                Attachments
              </label>

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
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Publishing..."
                : isEdit
                  ? "Save Changes"
                  : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementFormDialog;
