# conviz
visualization of concepts in my course work

Interactive visual aids for AI course concepts: Bayes' theorem, Naive Bayes, Bayesian networks,
agent architecture, resolution, forward/backward chaining, agent negotiation,
reinforcement learning, Markov chains, minimax, alpha-beta pruning, aspiration
windows, expectiminimax, Monte Carlo tree search and constraint satisfaction.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/lib/concepts.ts` — registry of concepts (slug, title, category, summary)
- `src/app/page.tsx` — index of all concepts grouped by category
- `src/app/concepts/[slug]/page.tsx` — one statically generated page per concept

To add a concept, add an entry to `concepts` in `src/lib/concepts.ts`.

## Deployment

Built with Next.js and deployed on Vercel. Import the repository at
https://vercel.com/new — the default Next.js settings work as-is.
