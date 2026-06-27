import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo size={34} />
        <div className="flex items-center gap-1 sm:gap-2">
          <MegaMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
