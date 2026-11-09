import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { visualizations } from "@/components/viz";
import { concepts, getConcept } from "@/lib/concepts";

export function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/concepts/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const concept = getConcept(slug);
  return concept
    ? { title: concept.title, description: concept.summary }
    : {};
}

export default async function ConceptPage(
  props: PageProps<"/concepts/[slug]">,
) {
  const { slug } = await props.params;
  const concept = getConcept(slug);
  if (!concept) notFound();
  const Visualization = visualizations[slug];

  return (
    <article className="space-y-8">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← All concepts
      </Link>
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-muted">
          {concept.category}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {concept.title}
        </h1>
        <p className="max-w-2xl text-muted">{concept.summary}</p>
      </header>
      {Visualization ? (
        <Visualization />
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-surface text-sm text-muted">
          Visualization coming soon
        </div>
      )}
    </article>
  );
}
