// src/components/icons/SettingsHideIcon.tsx

import React from 'react';

const SettingsHideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
  >
    {/* Primary polygon */}
    <polygon
      fill="#00B4D7"
      points="48.872,290.669 115.687,223.854 195.866,304.032 195.866,10.043 316.134,10.043
              316.134,304.032 396.314,223.854 463.129,290.669 256,497.797"
    />
    {/* Shadow layer */}
    <polygon
      fill="#0093C4"
      points="463.129,290.669 396.314,223.854 316.134,304.032 316.134,10.043
              256,10.043 256,497.797"
    />
    {/* Outline */}
    <path
      d="M256,512L34.669,290.669l81.017-81.017l70.136,70.136V0h140.354v279.787l70.136-70.136
         l81.018,81.017L256,512z M63.074,290.669L256,483.595l192.926-192.926l-52.614-52.613
         l-90.221,90.221V20.085H205.907v308.191l-90.221-90.221L63.074,290.669z"
      fill="#2F2F2F"
    />
    {/* Accent bar */}
    <rect
      x="327.81"
      y="268.403"
      transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 325.158 846.2971)"
      fill="#FFFFFF"
      width="20.085"
      height="174.807"
    />
  </svg>
);

export default SettingsHideIcon;