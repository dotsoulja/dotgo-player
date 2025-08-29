import React from 'react';
import { Icons } from './index';

interface IconButtonProps {
  icon: keyof typeof Icons;
  onClick: () => void;
  label: string;
  className?: string;
}

const buttonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  label,
  className,
}) => {
  const Icon = Icons[icon];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={className}
      style={buttonStyle}
    >
      <Icon className="icon" />
    </button>
  );
};

export default IconButton;