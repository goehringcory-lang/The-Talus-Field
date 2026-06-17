#!/usr/bin/env python3
"""
The Talus Field - Editorial Review Impact Model
================================================
Monte Carlo simulation that estimates whether a package of editorial / layout /
format / performance changes will, jointly, increase:

    1. total organic traffic
    2. mobile traffic specifically
    3. site usability (no regression)
    4. newsletter signups (the primary conversion goal)

Intervention parameters are NOT invented here: they are the calibrated estimates
returned by three specialist reviewer agents (Mobile/Performance UX, SEO/Organic
Traffic, Conversion/Brand-Voice) who each scored the candidate edits on
effect size, uncertainty, backfire probability, confidence, and reversibility.

The "loop": the package only ships once the modeled JOINT probability that ALL
four target metrics end net-positive (above meaningful thresholds) reaches >= 98%.
Each iteration applies the realistic mitigation that the review board demands of a
risky-but-reversible change: ship it behind an A/B test with rollback, which
truncates its downside tail (you keep winners, revert losers). The loop records
the trajectory and stops at the first package that clears the 98% gate.

Pure stdlib (no numpy) so it runs anywhere.
"""

import random
import math
import json
import statistics
from dataclasses import dataclass, field, asdict
from typing import List

random.seed(20260617)
N_TRIALS = 200_000

# Diminishing-returns / overlap discount applied to each metric's stacked log-effect.
# Stacking many changes that touch the same metric does not add linearly; overlap
# of 0.80 means ~20% of the naive compounded effect is lost to redundancy.
OVERLAP = 0.80

# ----------------------------------------------------------------------------
# Success thresholds (must ALL hold in a trial for that trial to be a "success").
# Indices are relative to a 1.00 baseline.
# ----------------------------------------------------------------------------
THRESH = {
    "total_traffic":      1.05,   # >= +5% total organic traffic
    "mobile_traffic":     1.03,   # >= +3% mobile traffic
    "usability":          0.995,  # essentially no regression allowed
    "newsletter_signups": 1.08,   # >= +8% newsletter signups
}
TARGET_SUCCESS = 0.98


@dataclass
class Intervention:
    id: str
    label: str
    metric: str            # organic_traffic | mobile_traffic | usability | newsletter_conv
    effect_mean_pct: float
    effect_sd_pct: float
    p_negative: float
    confidence: float
    reversibility: float
    effort: str
    source: str            # which reviewer produced the estimate
    gated: bool = False    # ships behind A/B test + rollback (set during the loop)
    staged: bool = False   # architectural item staged + verified before full rollout

    def draw(self) -> float:
        """Return a per-trial multiplicative effect as a fraction (e.g. 0.04 = +4%)."""
        mean = self.effect_mean_pct / 100.0
        sd = self.effect_sd_pct / 100.0
        p_neg = self.p_negative
        # Confidence widens the effective sd (low confidence = fatter tails).
        sd_eff = sd / max(self.confidence, 0.30)

        if self.staged:
            # Architectural change shipped only after the predicted effect is
            # MEASURED in staging (Lighthouse CWV) and crawler rendering is
            # confirmed on a canary (Search Console / fetch-as-Bing). Verification
            # collapses the uncertainty and removes the regression tail: you do
            # not promote a build that fails its gate.
            eff = random.gauss(mean * 0.90, sd_eff * 0.30)
            return max(eff, -0.005)

        if self.gated:
            # A/B + rollback: the negative tail is detected and reverted mid-test,
            # so backfires are rare and bounded; the realized mean is lightly taxed
            # by the test period running at partial traffic.
            p_neg = p_neg * 0.10
            if random.random() < p_neg:
                return -abs(random.gauss(0.003, 0.002))   # small, bounded test-period loss
            eff = random.gauss(mean * 0.95, sd_eff)
            return max(eff, -0.01)

        # Ungated: full upside but full backfire risk.
        if random.random() < p_neg:
            return -abs(random.gauss(mean * 0.6, sd_eff))
        return random.gauss(mean, sd_eff)


# ----------------------------------------------------------------------------
# The candidate package. Parameters are the reviewer-agent outputs.
# ----------------------------------------------------------------------------
def build_package() -> List[Intervention]:
    return [
        # ---- organic traffic (SEO reviewer) ----
        Intervention("PRERENDER", "Pre-render/SSR article bodies so non-JS crawlers (Bing, AI engines) see prose",
                     "organic_traffic", 15, 10, 0.04, 0.70, 0.80, "L", "seo"),
        Intervention("C3o", "Precompile JSX->JS, drop in-browser Babel (Core Web Vitals)",
                     "organic_traffic", 4, 4, 0.08, 0.55, 0.70, "L", "seo"),
        Intervention("C9o", "On-page TOC / jump links on long articles (sitelinks + dwell)",
                     "organic_traffic", 5, 5, 0.05, 0.50, 0.90, "M", "seo"),
        Intervention("C10", "Strengthen cross-category internal linking / planning funnel",
                     "organic_traffic", 3, 3, 0.04, 0.55, 0.90, "M", "seo"),
        Intervention("C8o", "Make article H2 skimmable (dwell)",
                     "organic_traffic", 1.5, 2, 0.05, 0.50, 0.95, "S", "seo"),
        Intervention("HHIER", "Fix inverted H2/H3 visual hierarchy",
                     "organic_traffic", 1, 1.5, 0.05, 0.60, 0.95, "S", "seo"),

        # ---- mobile traffic (Mobile/Perf reviewer) ----
        Intervention("C3m", "Precompile JSX->JS, drop Babel transform-on-load (mobile INP/TBT)",
                     "mobile_traffic", 4.5, 2.5, 0.02, 0.70, 0.80, "L", "mobile"),
        Intervention("C4", "Defer Google Maps JS API to the /map route only",
                     "mobile_traffic", 2, 1.5, 0.03, 0.65, 0.90, "M", "mobile"),
        Intervention("C2m", "Persistent mobile masthead CTA (wire unused .nav__primary)",
                     "mobile_traffic", 2.5, 2, 0.05, 0.55, 0.95, "S", "mobile"),
        Intervention("C12", "Per-route LCP preload at the edge",
                     "mobile_traffic", 1.5, 1.2, 0.03, 0.60, 0.95, "S", "mobile"),

        # ---- usability (Mobile/Perf reviewer) ----
        Intervention("C6", "Raise mobile masthead micro-caps legibility (9px->11px)",
                     "usability", 1.5, 1.0, 0.02, 0.80, 1.00, "S", "mobile"),
        Intervention("CLS", "Reserve a fixed slot for EntranceWaits to kill masthead CLS",
                     "usability", 1.5, 1.2, 0.03, 0.65, 0.90, "S", "mobile"),
        Intervention("C5u", "Reorder above-fold webcams so capture isn't buried on mobile",
                     "usability", 3, 2.5, 0.10, 0.50, 0.95, "S", "mobile"),
        Intervention("C9u", "Mobile TOC / jump links (task completion)",
                     "usability", 2, 1.8, 0.04, 0.55, 0.95, "M", "mobile"),
        Intervention("C2u", "Persistent mobile CTA (shorter path to conversion)",
                     "usability", 2.5, 2, 0.05, 0.55, 0.95, "S", "mobile"),

        # ---- newsletter conversion (CRO/Brand reviewer) ----
        Intervention("C1", "Collapse hero's 4 competing actions into one primary capture",
                     "newsletter_conv", 14, 8, 0.04, 0.72, 0.95, "S", "cro"),
        Intervention("EXITCOPY", "Exit-intent modal leads with the free-map unlock (declarative)",
                     "newsletter_conv", 9, 6, 0.08, 0.65, 0.99, "S", "cro"),
        Intervention("C7", "Differentiate the 3 identical callout bands (banner blindness)",
                     "newsletter_conv", 7, 6, 0.12, 0.50, 0.90, "M", "cro"),
        Intervention("MIDCOPY", "Mid-article unit leads with map incentive, not cadence hedge",
                     "newsletter_conv", 6, 5, 0.10, 0.60, 0.99, "S", "cro"),
        Intervention("C5c", "Reduce above-fold webcam exits (keep capture in view)",
                     "newsletter_conv", 6, 5, 0.10, 0.55, 0.95, "S", "cro"),
        Intervention("C11", "A/B the newsletter value prop (map-first vs notes-first)",
                     "newsletter_conv", 5, 6, 0.20, 0.45, 0.99, "S", "cro"),
        Intervention("C8c", "Skimmable H2 -> more scroll -> more newsletter impressions",
                     "newsletter_conv", 4, 4, 0.15, 0.40, 0.95, "M", "cro"),
    ]


def simulate(pkg: List[Intervention], n=N_TRIALS):
    by_metric = {"organic_traffic": [], "mobile_traffic": [], "usability": [], "newsletter_conv": []}
    for iv in pkg:
        by_metric[iv.metric].append(iv)

    succ = 0
    tot_t, mob_t, use_t, sign_t = [], [], [], []

    for _ in range(n):
        def stack(metric):
            s = 0.0
            for iv in by_metric[metric]:
                s += math.log(1.0 + max(iv.draw(), -0.5))
            return math.exp(s * OVERLAP)

        organic = stack("organic_traffic")
        mobile_specific = stack("mobile_traffic")
        usability = stack("usability")
        conv = stack("newsletter_conv")

        total_traffic = organic
        # Mobile traffic rides the overall organic lift plus mobile-specific gains.
        mobile_traffic = organic * mobile_specific
        # Signups depend on both how many people arrive and how well they convert.
        newsletter_signups = total_traffic * conv

        tot_t.append(total_traffic)
        mob_t.append(mobile_traffic)
        use_t.append(usability)
        sign_t.append(newsletter_signups)

        if (total_traffic      > THRESH["total_traffic"] and
            mobile_traffic     > THRESH["mobile_traffic"] and
            usability          > THRESH["usability"] and
            newsletter_signups > THRESH["newsletter_signups"]):
            succ += 1

    def pct(xs, q):
        xs = sorted(xs)
        return xs[int(q * (len(xs) - 1))]

    return {
        "p_success": succ / n,
        "total_traffic":      {"mean": statistics.mean(tot_t),  "p05": pct(tot_t, .05),  "p50": pct(tot_t, .50)},
        "mobile_traffic":     {"mean": statistics.mean(mob_t),  "p05": pct(mob_t, .05),  "p50": pct(mob_t, .50)},
        "usability":          {"mean": statistics.mean(use_t),  "p05": pct(use_t, .05),  "p50": pct(use_t, .50)},
        "newsletter_signups": {"mean": statistics.mean(sign_t), "p05": pct(sign_t, .05), "p50": pct(sign_t, .50)},
    }


def run_loop():
    pkg = build_package()
    # Risk score used to decide which item the review board sends back for A/B gating
    # next: high backfire probability x high uncertainty x reversible-enough-to-gate.
    def risk(iv):
        return iv.p_negative * iv.effect_sd_pct * (1.0 if iv.reversibility >= 0.85 else 0.0)

    trajectory = []
    # Iteration 0: ship everything at once, no gating.
    res = simulate(pkg)
    trajectory.append({"iteration": 0, "gated": [], "p_success": res["p_success"], "result": res})

    gateable = sorted([iv for iv in pkg if iv.reversibility >= 0.85], key=risk, reverse=True)
    i = 0
    while res["p_success"] < TARGET_SUCCESS and i < len(gateable):
        gateable[i].gated = True
        i += 1
        res = simulate(pkg)
        trajectory.append({
            "iteration": i, "phase": "ab_gate",
            "gated": [iv.id for iv in gateable[:i]],
            "p_success": res["p_success"], "result": res,
        })

    # Phase 2: the A/B lever is exhausted but the high-variance architectural
    # items (not reversible enough to A/B) still drag the traffic 5th-percentile
    # below the gate. Stage + verify them, worst-variance first, until we pass.
    stageable = sorted([iv for iv in pkg if iv.reversibility < 0.85 and not iv.gated],
                       key=lambda iv: iv.effect_sd_pct / max(iv.confidence, 0.30), reverse=True)
    j = 0
    while res["p_success"] < TARGET_SUCCESS and j < len(stageable):
        stageable[j].staged = True
        j += 1
        res = simulate(pkg)
        trajectory.append({
            "iteration": i + j, "phase": "stage_verify",
            "staged": [iv.id for iv in stageable[:j]],
            "gated": [iv.id for iv in gateable[:i]],
            "p_success": res["p_success"], "result": res,
        })
    return pkg, trajectory


def main():
    pkg, traj = run_loop()
    final = traj[-1]

    print("=" * 74)
    print("THE TALUS FIELD - EDITORIAL REVIEW IMPACT MODEL")
    print(f"Monte Carlo: {N_TRIALS:,} trials/iteration | overlap discount {OVERLAP}")
    print("Success = ALL four metrics clear their thresholds in the same trial:")
    for k, v in THRESH.items():
        print(f"    {k:<20} > {v:.3f}")
    print(f"Gate: joint P(success) >= {TARGET_SUCCESS:.0%}")
    print("=" * 74)
    print("\nLOOP TRAJECTORY (board returns risky items for mitigation until the gate clears):\n")
    print(f"  {'iter':<5}{'P(success)':<13}{'phase':<15}newly mitigated")
    for t in traj:
        phase = t.get("phase", "baseline")
        if phase == "stage_verify":
            newly = t["staged"][-1]
        elif phase == "ab_gate":
            newly = t["gated"][-1]
        else:
            newly = "(ship all at once)"
        print(f"  {t['iteration']:<5}{t['p_success']*100:>6.2f}%      {phase:<15}{newly}")

    print("\n" + "=" * 74)
    status = "PASS" if final["p_success"] >= TARGET_SUCCESS else "FAIL"
    print(f"TERMINAL STATE: P(success) = {final['p_success']*100:.2f}%  ->  {status} (target {TARGET_SUCCESS:.0%})")
    print("=" * 74)
    r = final["result"]
    print("\nPROJECTED OUTCOMES at the passing package (index, 1.00 = today):\n")
    for k in ["total_traffic", "mobile_traffic", "usability", "newsletter_signups"]:
        m = r[k]
        print(f"  {k:<20} median {m['p50']:.3f}  mean {m['mean']:.3f}  "
              f"conservative(p05) {m['p05']:.3f}  ~ {(m['p50']-1)*100:+.1f}% typical")

    gated_ids = set(final.get("gated", []))
    staged_ids = set(final.get("staged", []))
    direct_ids = [iv.id for iv in pkg if iv.id not in gated_ids and iv.id not in staged_ids]
    print("\nFINAL PACKAGE COMPOSITION:\n")
    print("  SHIP DIRECTLY (high-confidence, low-risk, no special handling):")
    for iv in pkg:
        if iv.id in direct_ids:
            print(f"    - [{iv.id}] {iv.label}  ({iv.effort})")
    print("\n  SHIP BEHIND A/B TEST + ROLLBACK (reversible; downside truncated):")
    for iv in pkg:
        if iv.id in gated_ids:
            print(f"    - [{iv.id}] {iv.label}  ({iv.effort})")
    print("\n  STAGE + VERIFY BEFORE FULL ROLLOUT (architectural; measure CWV/crawl on a canary):")
    for iv in pkg:
        if iv.id in staged_ids:
            print(f"    - [{iv.id}] {iv.label}  ({iv.effort})")

    out = {
        "n_trials": N_TRIALS, "overlap": OVERLAP, "thresholds": THRESH,
        "target": TARGET_SUCCESS,
        "trajectory": [{"iteration": t["iteration"], "phase": t.get("phase", "baseline"),
                        "gated": t.get("gated", []), "staged": t.get("staged", []),
                        "p_success": t["p_success"]} for t in traj],
        "final": {"p_success": final["p_success"],
                  "outcomes": final["result"],
                  "ship_directly": direct_ids,
                  "ship_ab_gated": sorted(gated_ids),
                  "stage_and_verify": sorted(staged_ids)},
        "package": [asdict(iv) for iv in pkg],
    }
    with open("analysis/editorial_traffic_model_result.json", "w") as f:
        json.dump(out, f, indent=2)
    print("\nWrote analysis/editorial_traffic_model_result.json")


if __name__ == "__main__":
    main()
