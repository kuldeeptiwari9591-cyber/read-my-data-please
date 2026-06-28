import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <div className="shrink-0">
          <Logo size={30} />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          <div className="min-w-0 flex-1 sm:flex-initial">
            <MegaMenu />
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
