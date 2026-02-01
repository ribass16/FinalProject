import React from "react";

const FuelIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="9" height="14" rx="1" />
    <rect x="4" y="5" width="5" height="4" />
    <path d="M11 8h3l2 2v4a1 1 0 0 1-1 1h-1" />
    <path d="M2 17h9" />
    <circle cx="15" cy="11" r="1" fill="currentColor" />
  </svg>
);

export default FuelIcon;
