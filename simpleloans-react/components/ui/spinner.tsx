import React from "react";

interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "currentColor",
  className = "",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${className}`}
      {...props}
      aria-label="Loading"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
