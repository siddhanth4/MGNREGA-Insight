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
      <path d="M12 22v-6" />
      <path d="M12 8V2" />
      <path d="m15 11-2-2-2 2" />
      <path d="M12 16a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6Z" />
    </svg>
  );
}
