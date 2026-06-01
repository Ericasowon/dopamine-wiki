"use client";

interface InfoboxField {
  key: string;
  value: string;
}

interface WikiInfoboxProps {
  title: string;
  subtitle?: string | null;
  image?: string | null;
  fields: InfoboxField[];
  isOwner: boolean;
  onEdit?: () => void;
}

export default function WikiInfobox({
  title,
  subtitle,
  image,
  fields,
  isOwner,
  onEdit,
}: WikiInfoboxProps) {
  return (
    <aside className="w-64 shrink-0 self-start">
      <div className="border border-gray-300 rounded overflow-hidden shadow-sm bg-white text-sm">
        {/* ───── Header ───── */}
        <div
          style={{ backgroundColor: "#1a6e3c" }}
          className="px-3 py-2 text-center text-white"
        >
          <p className="font-bold text-base leading-snug">{title}</p>
          {subtitle && (
            <p className="text-xs text-white/80 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* ───── Image ───── */}
        <div className="bg-gray-50 border-b border-gray-200 flex items-center justify-center min-h-[8rem] p-2">
          {image ? (
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-48 object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-4 gap-1">
              {/* Simple image placeholder icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18M3 3v18M21 3v18"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <span className="text-xs">이미지 없음</span>
            </div>
          )}
        </div>

        {/* ───── Fields table ───── */}
        {fields.length > 0 && (
          <table className="w-full border-collapse">
            <tbody>
              {fields.map((field, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 first:border-t-0"
                >
                  <td className="bg-gray-100 px-2 py-1.5 font-medium text-gray-700 w-2/5 align-top whitespace-nowrap border-r border-gray-200">
                    {field.key}
                  </td>
                  <td className="px-2 py-1.5 text-gray-800 break-words align-top">
                    {field.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {fields.length === 0 && (
          <p className="px-3 py-2 text-gray-400 italic text-xs text-center">
            등록된 정보가 없습니다.
          </p>
        )}

        {/* ───── Edit button (owner only) ───── */}
        {isOwner && (
          <div className="border-t border-gray-200 px-2 py-2 bg-gray-50 flex justify-end">
            <button
              onClick={onEdit}
              className="text-xs border border-gray-400 px-2 py-0.5 rounded hover:bg-gray-100 text-gray-600 transition-colors flex items-center gap-1"
            >
              <span>✏️</span>
              <span>인포박스 편집</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
