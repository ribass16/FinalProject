import React from "react";

const ManualGearIcon = ({ className = "w-5 h-5" }) => (
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
    <circle cx="7" cy="6" r="1.5" />
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="17" cy="6" r="1.5" />
    <path d="M7 8v7" />
    <path d="M12 8v10" />
    <path d="M17 8v7" />
    <path d="M7 15h10" />
  </svg>
);

export default ManualGearIcon;
