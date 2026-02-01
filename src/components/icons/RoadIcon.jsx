import React from "react";

const RoadIcon = ({ className = "w-5 h-5" }) => (
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
    <path d="M3 22L7 2" />
    <path d="M17 2l4 20" />
    <path d="M12 5v2" />
    <path d="M12 11v2" />
    <path d="M12 17v2" />
  </svg>
);

export default RoadIcon;
