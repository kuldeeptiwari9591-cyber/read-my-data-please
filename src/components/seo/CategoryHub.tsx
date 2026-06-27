import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS, type ToolCategory } from "@/lib/tools";
import { AnswerBlock } from "@/components/seo/AnswerBlock";

export function CategoryHub({
  category,
  title,
  intro,
  answer,
}: {
  category: ToolCategory;
  title: string;
  intro: string;
  answer: string;
}) {
  const tools = TOOLS.filter((t) => t.category === category);
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold md:text-5xl" data-speakable>{title}</h1>
        <AnswerBlock title={title} answer={answer} />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
