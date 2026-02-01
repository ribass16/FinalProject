import React from "react";

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    {}
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
    <path d="M8 2v4M16 2v4" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 10h16" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default CalendarIcon;
