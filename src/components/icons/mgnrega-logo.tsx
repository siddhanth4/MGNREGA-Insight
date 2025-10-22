import type { SVGProps } from "react";

export function MgnregaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 20h10" />
      <path d="M10 20c0-2.5-1.5-5-5-5" />
      <path d="M14 20c0-2.5 1.5-5 5-5" />
      <path d="M12 15c0-4 4-4 4-8" />
      <path d="M8 11c0-4-4-4-4-8" />
    </svg>
  );
}
