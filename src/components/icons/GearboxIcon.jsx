import React from "react";

const GearboxIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5" cy="5" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M5 7v12h14M12 7v10M19 7v10" />
  </svg>
);

export default GearboxIcon;
