// src/components/icons/SettingsIcon.tsx

import React from 'react';

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
  >
    {/* Primary polygon shape */}
    <polygon
      fill="#00B4D7"
      points="463.129,221.331 396.313,288.146 316.133,207.968 316.133,501.957 195.866,501.957
              195.866,207.968 115.687,288.146 48.871,221.331 255.999,14.202"
    />
    {/* Shadow layer */}
    <polygon
      fill="#0093C4"
      points="48.871,221.331 115.687,288.146 195.866,207.968 195.866,501.957
              255.999,501.957 255.999,14.202"
    />
    {/* Outline and structure */}
    <path
      d="M326.176,512H185.823V232.212l-70.136,70.136L34.67,221.331L255.999,0L477.33,221.331
         l-81.018,81.017l-70.136-70.136V512z M205.908,491.915h100.184V183.723l90.221,90.221
         l52.614-52.613L255.999,28.404L63.073,221.331l52.613,52.613l90.221-90.221v308.193H205.908z"
      fill="#2F2F2F"
    />
    {/* Accent bar */}
    <rect
      x="164.104"
      y="68.783"
      transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 186.8459 389.7675)"
      fill="#FFFFFF"
      width="20.085"
      height="174.807"
    />
  </svg>
);

export default SettingsIcon;