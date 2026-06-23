import React from "react";

interface LogoProps {
  size?: "sm" | "lg";
}

export const Logo: React.FC<LogoProps> = ({ size = "sm" }) => {
  const isLg = size === "lg";

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`relative flex items-center justify-center flex-shrink-0 ${isLg ? "w-16 h-16" : "w-9 h-9"}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12 82 A 38 38 0 0 1 88 82"
            stroke="#27272a"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 12 82 A 38 38 0 0 1 74 50"
            stroke="#10b981"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="82"
            x2="71"
            y2="53"
            stroke="#ffffff"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="82" r="14" fill="#10b981" />
          <text
            x="50"
            y="87"
            fill="#000000"
            fontSize="14"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            E
          </text>
        </svg>
      </div>
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black tracking-wider text-white ${isLg ? "text-2xl mb-1" : "text-base"}`}
        >
          ENGLISH
        </span>
        <span
          className={`font-black tracking-widest text-emerald-500 ${isLg ? "text-xs" : "text-[9px]"}`}
        >
          TUNING
        </span>
      </div>
    </div>
  );
};
