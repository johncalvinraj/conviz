export type Category =
  | "Probabilistic Reasoning"
  | "Logic & Inference"
  | "Agents"
  | "Learning & Decision Processes"
  | "Search & Game Playing"
  | "Constraint Satisfaction";

export type Concept = {
  slug: string;
  title: string;
  category: Category;
  summary: string;
};

export const categories: Category[] = [
  "Probabilistic Reasoning",
  "Logic & Inference",
  "Agents",
  "Learning & Decision Processes",
  "Search & Game Playing",
  "Constraint Satisfaction",
];

export const concepts: Concept[] = [
  {
    slug: "bayes-theorem",
    title: "Bayes' Theorem",
    category: "Probabilistic Reasoning",
    summary:
      "Updating a prior belief with evidence to get a posterior: P(H|E) = P(E|H)·P(H) / P(E).",
  },
  {
    slug: "naive-bayes",
    title: "Naive Bayes",
    category: "Probabilistic Reasoning",
    summary:
      "Classification with Bayes' rule under the assumption that features are conditionally independent given the class.",
  },
  {
    slug: "bayesian-networks",
    title: "Bayesian Networks",
    category: "Probabilistic Reasoning",
    summary:
      "Directed acyclic graphs that encode conditional dependencies and support probabilistic inference.",
  },
  {
    slug: "resolution",
    title: "Inference through Resolution",
    category: "Logic & Inference",
    summary:
      "Proof by refutation: convert to CNF, negate the goal, and resolve clauses until the empty clause appears.",
  },
  {
    slug: "forward-backward-chaining",
    title: "Forward & Backward Chaining",
    category: "Logic & Inference",
    summary:
      "Data-driven and goal-driven inference over definite clauses and Horn knowledge bases.",
  },
  {
    slug: "agent-architecture",
    title: "Agent Architecture",
    category: "Agents",
    summary:
      "Simple reflex, model-based, goal-based, utility-based and learning agents and how they perceive and act.",
  },
  {
    slug: "agent-negotiation",
    title: "Negotiation between Agents",
    category: "Agents",
    summary:
      "Offers, concessions and agreement protocols between self-interested agents.",
  },
  {
    slug: "markov-chains",
    title: "Markov Chains",
    category: "Learning & Decision Processes",
    summary:
      "Memoryless state transitions, transition matrices and stationary distributions.",
  },
  {
    slug: "reinforcement-learning",
    title: "Reinforcement Learning",
    category: "Learning & Decision Processes",
    summary:
      "Learning a policy from reward through interaction: value iteration, Q-learning and exploration.",
  },
  {
    slug: "minimax",
    title: "Deterministic Two-Player Zero-Sum Games",
    category: "Search & Game Playing",
    summary:
      "Minimax search over game trees where one player's gain is the other's loss.",
  },
  {
    slug: "alpha-beta-pruning",
    title: "Alpha-Beta Pruning",
    category: "Search & Game Playing",
    summary:
      "Skipping branches that cannot affect the minimax decision by tracking alpha and beta bounds.",
  },
  {
    slug: "aspiration-windows",
    title: "Aspiration Windows",
    category: "Search & Game Playing",
    summary:
      "Searching with a narrow alpha-beta window around an expected value, re-searching on fail-high or fail-low.",
  },
  {
    slug: "expectiminimax",
    title: "Expectiminimax",
    category: "Search & Game Playing",
    summary:
      "Extending minimax with chance nodes to play stochastic games.",
  },
  {
    slug: "monte-carlo-tree-search",
    title: "Monte Carlo Tree Search",
    category: "Search & Game Playing",
    summary:
      "Selection, expansion, simulation and backpropagation guided by UCT.",
  },
  {
    slug: "constraint-satisfaction",
    title: "Constraint Satisfaction Problems",
    category: "Constraint Satisfaction",
    summary:
      "Variables, domains and constraints solved with backtracking, forward checking and arc consistency.",
  },
];

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}
