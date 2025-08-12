export function RamabkLogo({ className = "h-8 w-auto" }) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
      
      {/* Car silhouette */}
      <g transform="translate(10, 15)">
        <path
          d="M5 20 C5 18, 7 16, 10 16 L15 16 C18 13, 22 13, 25 16 L30 16 C33 16, 35 18, 35 20 L35 25 C35 27, 33 29, 30 29 L28 29 C28 32, 25 35, 22 35 C19 35, 16 32, 16 29 L14 29 C14 32, 11 35, 8 35 C5 35, 2 32, 2 29 L0 29 C-3 29, -5 27, -5 25 L-5 20 Z"
          fill="url(#logoGradient)"
          stroke="#1E40AF"
          strokeWidth="1"
        />
        {/* Car windows */}
        <path
          d="M8 16 L12 13 C15 10, 20 10, 23 13 L27 16"
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Car wheels */}
        <circle cx="8" cy="29" r="3" fill="#1E40AF" stroke="#F1F5F9" strokeWidth="1"/>
        <circle cx="22" cy="29" r="3" fill="#1E40AF" stroke="#F1F5F9" strokeWidth="1"/>
      </g>
      
      {/* RAMABK Text */}
      <text x="60" y="25" fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="700" fill="url(#textGradient)">
        RAMA
      </text>
      <text x="60" y="45" fontFamily="Inter, Arial, sans-serif" fontSize="14" fontWeight="500" fill="#94A3B8">
        DBK 
      </text>
      
      {/* Decorative elements */}
      <circle cx="185" cy="15" r="2" fill="#3B82F6" opacity="0.6"/>
      <circle cx="190" cy="25" r="1.5" fill="#1D4ED8" opacity="0.8"/>
      <circle cx="188" cy="35" r="1" fill="#1E40AF"/>
    </svg>
  )
}
