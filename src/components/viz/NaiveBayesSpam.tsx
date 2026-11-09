"use client";

import { useState } from "react";
import { Card, Formula, Metric, Metrics, Prose, Slider } from "./ui";

// Illustrative [P(word | spam), P(word | ham)] values, not real estimates.
const VOCAB: Record<string, [number, number]> = {
  free: [0.3, 0.03],
  winner: [0.12, 0.005],
  prize: [0.08, 0.003],
  click: [0.25, 0.04],
  money: [0.15, 0.02],
  offer: [0.18, 0.04],
  urgent: [0.1, 0.02],
  you: [0.7, 0.55],
  today: [0.2, 0.15],
  the: [0.9, 0.9],
  thanks: [0.08, 0.3],
  report: [0.02, 0.12],
  attached: [0.03, 0.18],
  meeting: [0.02, 0.2],
  lunch: [0.01, 0.08],
  project: [0.01, 0.15],
};

const PRESETS = [
  {
    label: "Spammy email",
    text: "Urgent: you are a winner! Click here today to claim your free prize money",
  },
  {
    label: "Work email",
    text: "Thanks, the project report is attached for the meeting today",
  },
  {
    label: "Mixed signals",
    text: "Free lunch after the meeting today, click the attached offer",
  },
];

const RED = "#D85A30";
const BLUE = "#378ADD";
const GRAY = "var(--muted)";
const ROW = 28;

const llr = (w: string) => Math.log(VOCAB[w][0] / VOCAB[w][1]);
const signed = (v: number, digits = 2) =>
  `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(digits)}`;
// Maps log-odds in [-8, 8] onto the SVG x axis.
const X = (v: number) => 340 + Math.max(-8, Math.min(8, v)) * 37.5;

const CHIPS = Object.keys(VOCAB).sort((a, b) => llr(b) - llr(a));

type Step = { from: number; to: number; color: string; label: string };

function StepRow({ from, to, color, label, y }: Step & { y: number }) {
  const x1 = X(from);
  const x2 = X(to);
  const right = to >= from;
  // Put the label past the arrowhead, unless it would run off the edge.
  const flip = right ? Math.max(x1, x2) + 10 > 560 : Math.min(x1, x2) - 10 < 120;
  const toRight = right !== flip;
  const lx = toRight ? Math.max(x1, x2) + 10 : Math.min(x1, x2) - 10;
  return (
    <g>
      {Math.abs(x2 - x1) > 3 ? (
        <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="2.5" markerEnd="url(#nb-arrow)" />
      ) : (
        <circle cx={x1} cy={y} r={3} fill={color} />
      )}
      <text x={lx} y={y + 4} textAnchor={toRight ? "start" : "end"} className="fill-muted text-xs">
        {label}
      </text>
      <line x1={x2} y1={y} x2={x2} y2={y + ROW} stroke={GRAY} strokeOpacity={0.5} strokeWidth="0.5" strokeDasharray="2 2" />
    </g>
  );
}

export default function NaiveBayesSpam() {
  const [email, setEmail] = useState(PRESETS[0].text);
  const [prior, setPrior] = useState(40);

  const words: string[] = [];
  const ignored = new Set<string>();
  for (const t of email.toLowerCase().match(/[a-z']+/g) ?? []) {
    if (Object.hasOwn(VOCAB, t)) {
      if (!words.includes(t)) words.push(t);
    } else ignored.add(t);
  }

  const p0 = Math.log(prior / 100 / (1 - prior / 100));
  const steps: Step[] = [{ from: 0, to: p0, color: GRAY, label: `prior ${signed(p0)}` }];
  let logOdds = p0;
  for (const w of words) {
    const l = llr(w);
    steps.push({ from: logOdds, to: logOdds + l, color: l >= 0 ? RED : BLUE, label: `${w} ${signed(l)}` });
    logOdds += l;
  }
  const post = 1 / (1 + Math.exp(-logOdds));
  const spam = post >= 0.5;

  const H = 78 + (words.length + 2) * ROW + 60;
  const markerY = 78 + steps.length * ROW;
  const markerX = X(logOdds);
  const axisY = H - 44;

  const addWord = (w: string) => setEmail((e) => `${e.trim()} ${w}`.trim());
  const ignoredList = [...ignored];

  return (
    <div className="space-y-8">
      <Prose>
        <p className="text-muted">
          The marker starts at the prior. Each known word in the email pushes
          it by its log-likelihood ratio: red toward spam, blue toward ham.
          Where it ends up is P(spam | email).
        </p>
      </Prose>

      <Card>
        <div className="mb-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setEmail(p.text)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface"
            >
              {p.label}
            </button>
          ))}
        </div>
        <textarea
          rows={2}
          aria-label="Email text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full resize-y rounded-lg border border-border bg-background p-2 text-sm"
        />
        <p className="mt-2 mb-1 text-[13px] text-muted">
          Known words (tap to add to the email):
        </p>
        <div>
          {CHIPS.map((w) => {
            const l = llr(w);
            const tone =
              l > 0.5
                ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
                : l < -0.5
                  ? "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-surface text-muted";
            return (
              <button
                key={w}
                onClick={() => addWord(w)}
                className={`mr-1.5 mb-1.5 rounded-lg border border-border px-2.5 py-0.5 text-[13px] ${tone}`}
              >
                {w} {signed(l, 1)}
              </button>
            );
          })}
        </div>
        <Slider label="Prior P(spam)" value={prior} min={5} max={95} onChange={setPrior} />

        <svg width="100%" viewBox={`0 0 680 ${H}`} role="img">
          <title>Log-odds tug of war</title>
          <desc>Arrows for each word move a marker toward spam or ham.</desc>
          <defs>
            <marker id="nb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <rect x="40" y="50" width="300" height={H - 100} fill={BLUE} fillOpacity={0.07} />
          <rect x="340" y="50" width="300" height={H - 100} fill={RED} fillOpacity={0.07} />
          <text x="44" y="38" className="fill-foreground text-sm font-medium">← ham</text>
          <text x="636" y="38" textAnchor="end" className="fill-foreground text-sm font-medium">spam →</text>
          <line x1="340" y1="50" x2="340" y2={H - 50} stroke={GRAY} strokeWidth="0.5" strokeDasharray="4 3" />

          {steps.map((s, i) => (
            <StepRow key={i} {...s} y={78 + i * ROW} />
          ))}

          <circle cx={markerX} cy={markerY} r={7} fill={spam ? RED : BLUE} />
          <text
            x={markerX > 480 ? markerX - 14 : markerX + 14}
            y={markerY + 5}
            textAnchor={markerX > 480 ? "end" : "start"}
            className="fill-foreground text-sm font-medium"
          >
            P(spam) = {(post * 100).toFixed(1)}%
          </text>

          <line x1="40" y1={axisY} x2="640" y2={axisY} stroke={GRAY} strokeOpacity={0.5} strokeWidth="0.5" />
          {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((t) => {
            const p = 1 / (1 + Math.exp(-t));
            const label = p < 0.01 || p > 0.99 ? (p * 100).toFixed(1) : Math.round(p * 100);
            return (
              <g key={t}>
                <line x1={X(t)} y1={axisY} x2={X(t)} y2={axisY + 4} stroke={GRAY} strokeOpacity={0.5} strokeWidth="0.5" />
                <text x={X(t)} y={axisY + 18} textAnchor="middle" className="fill-muted text-xs">
                  {label}%
                </text>
              </g>
            );
          })}
          <text x="340" y={axisY + 34} textAnchor="middle" className="fill-muted text-xs">
            Axis: log-odds, labelled as P(spam)
          </text>
        </svg>

        <Metrics>
          <Metric label="Prior log-odds" value={signed(p0)} />
          <Metric label="Sum of word evidence" value={signed(logOdds - p0)} />
          <Metric label="Posterior P(spam | email)" value={`${(post * 100).toFixed(1)}%`} />
          <Metric
            label="Verdict"
            value={spam ? "Spam" : "Ham"}
            className={spam ? "text-red-700 dark:text-red-300" : "text-blue-700 dark:text-blue-300"}
          />
        </Metrics>

        <p className="mt-4 font-mono text-[13px] whitespace-pre-line text-muted [overflow-wrap:anywhere]">
          {`log-odds = ${p0.toFixed(2)} + (${words.map((w) => llr(w).toFixed(2)).join(" + ") || "0"}) = ${logOdds.toFixed(2)}  →  P = 1/(1+e^−${logOdds.toFixed(2)}) = ${post.toFixed(3)}`}
          {ignoredList.length > 0 &&
            `\nIgnored (not in vocabulary): ${ignoredList.slice(0, 10).join(", ")}${ignoredList.length > 10 ? "…" : ""}`}
        </p>
      </Card>

      <Prose>
        <h2>Why the steps add up</h2>
        <p>For an email with words w₁ … wₙ, Bayes&rsquo; theorem gives:</p>
        <Formula>P(spam | email) ∝ P(spam) · P(w₁, …, wₙ | spam)</Formula>
        <p>
          The &ldquo;naive&rdquo; step assumes the words are independent once
          you know the class, so the joint probability becomes a product:
        </p>
        <Formula>P(w₁, …, wₙ | spam) = Πᵢ P(wᵢ | spam)</Formula>
        <p>Divide the spam version by the ham version. The hard-to-compute P(email) cancels:</p>
        <Formula>
          P(spam|email) / P(ham|email) = [P(spam)/P(ham)] · Πᵢ [P(wᵢ|spam) / P(wᵢ|ham)]
        </Formula>
        <p>Take logs and the product becomes a sum, which is the chain of arrows above:</p>
        <Formula>log-odds = log-prior + Σᵢ log[P(wᵢ|spam) / P(wᵢ|ham)]</Formula>
        <p>
          The sigmoid turns it back into a probability: P = 1 / (1 + e
          <sup>−log-odds</sup>).
        </p>

        <h2>Things to try</h2>
        <ul>
          <li>
            Load &ldquo;Mixed signals&rdquo;: spammy words and work words pull
            against each other, and the verdict depends on which side adds up
            to more.
          </li>
          <li>
            Move the prior slider. It only shifts the starting point; strong
            word evidence still outweighs it.
          </li>
          <li>
            Add &ldquo;the&rdquo;. It&rsquo;s equally common in both classes,
            so its ratio is 1 and its log is 0.
          </li>
          <li>
            Add &ldquo;click&rdquo; and &ldquo;free&rdquo; together. They tend
            to appear in the same spam, but the model counts them as separate
            evidence, so it ends up overconfident. That&rsquo;s the cost of the
            &ldquo;naive&rdquo; assumption.
          </li>
        </ul>

        <h2>Simplifications</h2>
        <ul>
          <li>
            The word probabilities are illustrative numbers, not estimates from
            real data. A real filter counts words in labelled emails and uses
            Laplace smoothing so nothing is exactly 0.
          </li>
          <li>
            Each word counts once, and absent words count not at all.
            Multinomial naive Bayes adds an arrow for every repeat; Bernoulli
            naive Bayes also adds a small arrow for each vocabulary word
            missing from the email.
          </li>
          <li>Words outside the vocabulary are ignored and listed under the formula.</li>
        </ul>
      </Prose>
    </div>
  );
}
