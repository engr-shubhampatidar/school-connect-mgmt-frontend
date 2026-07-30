import { Pencil, Trash2, Paperclip } from "lucide-react";

interface Attachment {
  filename?: string | null;
  url?: string | null;
}

interface AnnouncementCardProps {
  status: string;
  role: string;
  dateTime: string;
  title: string;
  message: string;
  attachments?: Attachment[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AnnouncementCard({
  status,
  role,
  dateTime,
  title,
  message,
  attachments,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  return (
    <div className="w-full rounded-xl border border-blue-200 bg-white px-6 py-5 shadow-sm">
      {/* Top Meta */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          {status}
        </span>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {role}
        </span>

        <span className="text-[14px] ">{dateTime}</span>
      </div>

      {/* Title */}
      <h2 className="mt-4 text-[24px] font-[600] text-[#021034]">{title}</h2>

      {/* Description */}
      <p className="mt-2 text-[16px] font-[400] leading-relaxed text-[#737373]">
        {message}
      </p>

      {/* Divider */}
      <div className="my-4 border-t border-blue-200" />

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Attachment */}
        {attachments && attachments.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Paperclip size={16} />
            <div className="flex">
              {attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att?.url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:underline"
                >
                  {att?.filename && att.filename.length > 0
                    ? att.filename
                    : (att?.url ?? "attachment")}
                </a>
              ))}
            </div>
          </div>
        )}
        {/* From UI fix, It is only for now later you have to change these things */}
        <p className="h-1 w-1"></p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
