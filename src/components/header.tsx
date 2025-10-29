import Link from 'next/link';
import { MgnregaLogo } from '@/components/icons/mgnrega-logo';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur-sm md:px-6 lg:px-12">
      <Link href="/" className="flex items-center gap-3">
        <MgnregaLogo className="h-8 w-8 text-primary" />
        <span className="font-headline text-2xl font-bold tracking-tight">MGNREGA Insight</span>
      </Link>
      <LanguageSwitcher />
    </header>
  );
}
