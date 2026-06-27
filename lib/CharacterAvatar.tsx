"use client";

export function CharacterAvatar({ gender, size = 80 }: { gender: "male" | "female"; size?: number }) {
  const scale = size / 80;

  if (gender === "female") {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hair back */}
        <ellipse cx="40" cy="38" rx="30" ry="32" fill="#5B3A29" />
        {/* Face */}
        <ellipse cx="40" cy="40" rx="22" ry="24" fill="#F5D0A9" />
        {/* Hair front */}
        <path d="M18 32 C18 18, 62 18, 62 32 C62 26, 54 20, 40 20 C26 20, 18 26, 18 32Z" fill="#5B3A29" />
        {/* Hair sides */}
        <path d="M14 36 C12 50, 16 58, 20 56 C18 48, 16 40, 18 34Z" fill="#5B3A29" />
        <path d="M66 36 C68 50, 64 58, 60 56 C62 48, 64 40, 62 34Z" fill="#5B3A29" />
        {/* Eyes */}
        <ellipse cx="32" cy="40" rx="2.5" ry="3" fill="#333" />
        <ellipse cx="48" cy="40" rx="2.5" ry="3" fill="#333" />
        {/* Eye highlights */}
        <circle cx="33" cy="39" r="1" fill="white" />
        <circle cx="49" cy="39" r="1" fill="white" />
        {/* Eyebrows */}
        <path d="M28 35 Q32 33, 36 35" stroke="#5B3A29" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M44 35 Q48 33, 52 35" stroke="#5B3A29" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Nose */}
        <path d="M39 44 Q40 46, 41 44" stroke="#D4A574" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Smile */}
        <path d="M34 50 Q40 55, 46 50" stroke="#C97B63" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="28" cy="48" rx="4" ry="2.5" fill="#F8B4B4" opacity="0.4" />
        <ellipse cx="52" cy="48" rx="4" ry="2.5" fill="#F8B4B4" opacity="0.4" />
        {/* Collar / shirt */}
        <path d="M24 64 Q32 70, 40 68 Q48 70, 56 64 Q58 72, 56 80 L24 80 Q22 72, 24 64Z" fill="#4A9EC5" />
        <path d="M36 66 L40 72 L44 66" fill="white" opacity="0.8" />
      </svg>
    );
  }

  // Male
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair */}
      <path d="M16 30 C16 14, 64 14, 64 30 C64 24, 56 18, 40 18 C24 18, 16 24, 16 30Z" fill="#3D2B1F" />
      <rect x="16" y="24" width="48" height="8" rx="2" fill="#3D2B1F" />
      {/* Face */}
      <path d="M20 34 C20 22, 60 22, 60 34 L60 48 C60 62, 20 62, 20 48Z" fill="#F5D0A9" />
      {/* Jaw line - slightly squarer */}
      <path d="M22 48 C22 58, 58 58, 58 48" fill="#F5D0A9" />
      {/* Eyes */}
      <ellipse cx="32" cy="40" rx="2.5" ry="2.5" fill="#333" />
      <ellipse cx="48" cy="40" rx="2.5" ry="2.5" fill="#333" />
      {/* Eye highlights */}
      <circle cx="33" cy="39" r="1" fill="white" />
      <circle cx="49" cy="39" r="1" fill="white" />
      {/* Eyebrows */}
      <path d="M27 35 Q32 32, 37 35" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M43 35 Q48 32, 53 35" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M38 44 Q40 47, 42 44" stroke="#D4A574" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d="M34 50 Q40 54, 46 50" stroke="#C97B63" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Collar / shirt */}
      <path d="M22 62 Q30 68, 40 66 Q50 68, 58 62 Q60 72, 58 80 L22 80 Q20 72, 22 62Z" fill="#2D6A4F" />
      <path d="M37 64 L40 70 L43 64" fill="white" opacity="0.8" />
    </svg>
  );
}
