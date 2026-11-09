import Link from "next/link";
import { categories, concepts } from "@/lib/concepts";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Concept visualizations
        </h1>
        <p className="max-w-2xl text-muted">
          Interactive visual aids for topics in AI: probabilistic reasoning,
          logical inference, agents, learning, game playing and constraint
          satisfaction.
        </p>
      </section>

      {categories.map((category) => (
        <section key={category} className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
            {category}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {concepts
              .filter((c) => c.category === category)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/concepts/${c.slug}`}
                    className="block h-full rounded-lg border border-border bg-surface p-5 transition-colors hover:border-foreground/40"
                  >
                    <h3 className="font-medium">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted">{c.summary}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
