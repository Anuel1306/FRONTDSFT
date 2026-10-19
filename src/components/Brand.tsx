export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function ConferenceArtwork() {
  const nodes = [
    [88, 267, 8],
    [177, 187, 13],
    [282, 256, 9],
    [381, 140, 16],
    [478, 218, 10],
    [137, 82, 10],
    [320, 67, 8],
    [456, 69, 7],
    [361, 335, 8],
  ];

  return (
    <svg className="recovery-art conference-art" viewBox="0 0 560 420" role="img" aria-label="Red abstracta de conocimiento académico">
      <defs>
        <linearGradient id="node-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#A5B4FC" />
          <stop offset="1" stopColor="#67E8F9" />
        </linearGradient>
        <linearGradient id="glass-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EEF2FF" stopOpacity=".17" />
          <stop offset="1" stopColor="#A5B4FC" stopOpacity=".03" />
        </linearGradient>
      </defs>
      <path className="network-line" d="M88 267 177 187 282 256 381 140 478 218M137 82l40 105L320 67l61 73 75-71M282 256l79 79 117-117" />
      <g className="data-card data-card-one">
        <rect x="55" y="231" width="112" height="88" rx="18" fill="url(#glass-gradient)" />
        <path d="M79 291v-27m18 27v-42m18 42v-20m18 20v-33" />
      </g>
      <g className="data-card data-card-two">
        <rect x="289" y="30" width="139" height="83" rx="18" fill="url(#glass-gradient)" />
        <circle cx="317" cy="62" r="9" />
        <path d="M340 57h59M340 73h42M311 91h88" />
      </g>
      <g className="data-card data-card-three">
        <rect x="349" y="302" width="133" height="67" rx="18" fill="url(#glass-gradient)" />
        <path d="M377 336h76" />
      </g>
      {nodes.map(([cx, cy, r], index) => (
        <circle
          key={`${cx}-${cy}`}
          className={`network-node network-node-${(index % 3) + 1}`}
          cx={cx}
          cy={cy}
          r={r}
          fill={index === 3 ? 'url(#node-gradient)' : '#C7D2FE'}
        />
      ))}
      <g className="center-node">
        <circle cx="177" cy="187" r="46" fill="#EEF2FF" fillOpacity=".11" />
        <circle cx="177" cy="187" r="32" fill="#818CF8" />
        <path d="m161 187 10 10 22-23" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
