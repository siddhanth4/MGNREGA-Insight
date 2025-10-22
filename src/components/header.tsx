import Link from 'next/link';
import { MgnregaLogo } from '@/components/icons/mgnrega-logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <MgnregaLogo className="h-6 w-6 text-primary" />
        <span className="font-headline text-lg font-bold">MGNREGA Insight</span>
      </Link>
    </header>
  );
}
