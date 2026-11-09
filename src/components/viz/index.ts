import type { ComponentType } from "react";
import BayesTheorem from "./BayesTheorem";
import NaiveBayesSpam from "./NaiveBayesSpam";

// Concept slug → interactive visualization. Concepts without an entry show a placeholder.
export const visualizations: Record<string, ComponentType> = {
  "bayes-theorem": BayesTheorem,
  "naive-bayes": NaiveBayesSpam,
};
