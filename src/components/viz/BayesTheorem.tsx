"use client";

import { useMemo, useState } from "react";
import { Card, Formula, Metric, Metrics, Prose, Slider } from "./ui";

const SICK = "#1D9E75";
const POSITIVE = "#D85A30";
const HEALTHY = "var(--muted)";
// Scales probabilities to circle areas in SVG units.
const AREA = 150000;
const CY = 215;

type Point = { x: number; y: number; p: number };

// Area of intersection of two circles with radii r1, r2 whose centres are d apart.
function overlapArea(d: number, r1: number, r2: number) {
  if (d >= r1 + r2) return 0;
  if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2;
  const a = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
  const b = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
  const c =
    0.5 *
    Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
  return a + b - c;
}

// Seeded so icon positions are identical on server and client.
let seed = 7;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// Jittered candidate positions in random order; G2 is a finer fallback grid.
function grid(spacing: number): Point[] {
  const points: Point[] = [];
  for (let y = 60; y <= 368; y += spacing)
    for (let x = 32; x <= 648; x += spacing)
      points.push({
        x: x + (rand() - 0.5) * spacing * 0.35,
        y: y + (rand() - 0.5) * spacing * 0.35,
        p: rand(),
      });
  return points.sort((a, b) => a.p - b.p);
}
const G1 = grid(15);
const G2 = grid(8);

function layout(pa: number, pba: number, pbn: number) {
  const pab = pba * pa;
  const pan = pa - pab;
  const pfp = pbn * (1 - pa);
  const ptn = 1 - pa - pfp;
  const pb = pab + pfp;

  const rA = Math.sqrt((pa * AREA) / Math.PI);
  const rB = Math.max(Math.sqrt((pb * AREA) / Math.PI), 0.5);
  const target = pab * AREA;
  // Bisect for the centre distance whose overlap area matches P(A ∩ B).
  let lo = Math.abs(rA - rB);
  let hi = rA + rB;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (overlapArea(m, rA, rB) > target) lo = m;
    else hi = m;
  }
  const d = (lo + hi) / 2;
  const xA = 340 - d / 2;
  const xB = 340 + d / 2;

  const M = 6;
  const dist = (p: Point, x: number) => Math.hypot(p.x - x, p.y - CY);
  const inA = (p: Point) => dist(p, xA) < rA - M;
  const outA = (p: Point) => dist(p, xA) > rA + M;
  const inB = (p: Point) => dist(p, xB) < rB - M;
  const outB = (p: Point) => dist(p, xB) > rB + M;

  const regions = [
    { n: Math.round(pab * 200), fits: (p: Point) => inA(p) && inB(p), sick: true },
    { n: Math.round(pan * 200), fits: (p: Point) => inA(p) && outB(p), sick: true },
    { n: Math.round(pfp * 200), fits: (p: Point) => inB(p) && outA(p), sick: false },
    { n: Math.round(ptn * 200), fits: (p: Point) => outA(p) && outB(p), sick: false },
  ];
  const icons: { x: number; y: number; sick: boolean }[] = [];
  for (const r of regions) {
    let k = 0;
    for (const g of [G1, G2]) {
      for (const p of g) {
        if (k >= r.n) break;
        if (
          r.fits(p) &&
          !icons.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 9)
        ) {
          icons.push({ x: p.x, y: p.y, sick: r.sick });
          k++;
        }
      }
    }
  }

  return { pab, pfp, pb, post: pb > 0 ? pab / pb : 0, xA, xB, rA, rB, icons };
}

function Person({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
      <circle cy={-3} r={2.4} fill={color} />
      <path d="M-4 6Q-4 0 0 0Q4 0 4 6Z" fill={color} />
    </g>
  );
}

function LegendIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="14" viewBox="-6 -7 12 14" className="inline align-[-2px]">
      <Person x={0} y={0} color={color} />
    </svg>
  );
}

export default function BayesTheorem() {
  const [prevalence, setPrevalence] = useState(5);
  const [sensitivity, setSensitivity] = useState(90);
  const [falsePositive, setFalsePositive] = useState(10);

  const { pab, pfp, pb, post, xA, xB, rA, rB, icons } = useMemo(
    () => layout(prevalence / 100, sensitivity / 100, falsePositive / 100),
    [prevalence, sensitivity, falsePositive],
  );
  const people = (x: number) => Math.round(x * 1000);

  return (
    <div className="space-y-8">
      <Prose>
        <p className="text-muted">
          A screening test on 1,000 people. Each icon is 5 people: green icons
          are sick, grey are healthy. Icons inside the orange circle tested
          positive. Move the sliders and watch who ends up inside it.
        </p>
      </Prose>

      <Card>
        <svg width="100%" viewBox="0 0 680 400" role="img">
          <title>Medical test Venn diagram with people</title>
          <desc>
            Person icons inside a rectangle of 1,000 people; green icons are
            sick, grey are healthy; icons inside the orange circle tested
            positive.
          </desc>
          <rect x="20" y="20" width="640" height="360" rx="8" fill="none" stroke="var(--muted)" strokeOpacity={0.4} strokeWidth="0.5" />
          <text x="34" y="42" className="fill-muted text-xs">
            1,000 people screened · 1 icon = 5 people
          </text>
          <circle cx={xB} cy={CY} r={rB} fill={POSITIVE} fillOpacity={0.18} stroke={POSITIVE} />
          <circle cx={xA} cy={CY} r={rA} fill={SICK} fillOpacity={0.18} stroke={SICK} />
          <rect x="400" y="32" width="12" height="12" rx="2" fill={SICK} fillOpacity={0.35} stroke={SICK} strokeWidth="0.5" />
          <text x="418" y="42" className="fill-muted text-xs">Has disease</text>
          <rect x="510" y="32" width="12" height="12" rx="2" fill={POSITIVE} fillOpacity={0.35} stroke={POSITIVE} strokeWidth="0.5" />
          <text x="528" y="42" className="fill-muted text-xs">Tests positive</text>
          {icons.map((p, i) => (
            <Person key={i} x={p.x} y={p.y} color={p.sick ? SICK : HEALTHY} />
          ))}
        </svg>
        <div className="mt-1.5 flex flex-wrap gap-5 text-[13px] text-muted">
          <span>
            <LegendIcon color={SICK} /> Sick person
          </span>
          <span>
            <LegendIcon color={HEALTHY} /> Healthy person
          </span>
        </div>

        <div className="mt-4">
          <Slider label="Disease prevalence, P(sick)" value={prevalence} min={1} max={35} onChange={setPrevalence} />
          <Slider label="Sensitivity, P(+ | sick)" value={sensitivity} min={0} max={100} onChange={setSensitivity} />
          <Slider label="False positives, P(+ | healthy)" value={falsePositive} min={0} max={20} onChange={setFalsePositive} />
        </div>

        <Metrics>
          <Metric label="Sick and positive" value={`${people(pab)} people`} />
          <Metric label="Healthy but positive" value={`${people(pfp)} people`} />
          <Metric label="All positives" value={`${people(pb)} people`} />
          <Metric label="P(sick | positive)" value={pb > 0 ? `${(post * 100).toFixed(1)}%` : "n/a"} />
        </Metrics>

        <p className="mt-4 text-sm text-muted">
          {pb > 0
            ? `Inside the orange circle there are ${people(pb)} people, but only ${people(pab)} of them are sick: ${people(pab)} ÷ ${people(pb)} ≈ ${(post * 100).toFixed(1)}%.`
            : "Nobody tests positive, so P(sick | positive) is undefined."}
        </p>
      </Card>

      <Prose>
        <h2>Why it works</h2>
        <p>
          Call &ldquo;has the disease&rdquo; A and &ldquo;tests positive&rdquo;
          B. The overlap A ∩ B can be measured from either circle:
        </p>
        <Formula>P(A ∩ B) = P(B|A) · P(A) = P(A|B) · P(B)</Formula>
        <p>Set the two equal and divide by P(B):</p>
        <Formula>P(A|B) = P(B|A) · P(A) / P(B)</Formula>
        <p>The denominator splits B into the part inside A and the part outside it:</p>
        <Formula>P(B) = P(B|A)·P(A) + P(B|¬A)·P(¬A)</Formula>
        <p>
          Once you know you tested positive, the orange circle becomes your
          whole world. P(sick | positive) is the share of that circle taken up
          by green icons.
        </p>

        <h2>Things to try</h2>
        <ul>
          <li>
            With the defaults (5% prevalence, 90% sensitivity, 10% false
            positives), only about 32% of positives are actually sick. The
            disease is rare, so false alarms from the large healthy group
            outnumber real cases.
          </li>
          <li>
            Raise prevalence to 30%, or drop false positives to 1%, and the
            green icons take over the orange circle.
          </li>
          <li>
            Check it by hand: (0.9 × 0.05) / (0.9 × 0.05 + 0.1 × 0.95) = 0.045
            / 0.14 ≈ 0.321.
          </li>
        </ul>
        <p className="text-[13px] text-muted">
          Circle areas are drawn to scale. Icons are rounded to the nearest 5
          people, so very small groups may show no icon; the counts in the
          cards are exact.
        </p>
      </Prose>
    </div>
  );
}
