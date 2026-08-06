/* global React */

// =============================================================================
// INTENT UI — the React for the reader-intent model in intent-data.js.
//
//   TripSelector      the five-question decision tool at the top of /planning
//   IntentFilters     the three-facet chip bar used on /planning and /articles
//   useIntentFilters  filter state, mirrored into the URL so a filtered view
//                     is a shareable link
//
// TripPlan renders plan.lodging (buildTripPlan, intent-data.js) through the
// shared window.LodgingCta from the eager components bundle, aff_list
// "trip_selector". The field is set only when the stay answer leaves the bed
// unbooked; every other stay answer renders no lodging placement.
//
// Compiled to /dist/intent.js and loaded, with intent-data.js, only on the
// `planning` and `articles` routes (PAGE_MODULES in app.jsx). Nothing here is in
// the eager shell, so the homepage pays nothing for it.
//
// Both surfaces mirror their state with replaceState, never pushState: a reader
// toggling six chips should not have to press Back six times to leave the page.
// =============================================================================

const { useState: useStateIn, useEffect: useEffectIn, useCallback: useCallbackIn } = React;

const TRIP_ANSWERS_KEY = "tfg.trip.selector";

// --- URL <-> state -----------------------------------------------------------

// Read one facet's selection out of the query string, dropping anything that is
// not a real option id so a hand-edited URL cannot put the UI into a state its
// own chips cannot represent. `month` gets the same treatment against
// TRIP_MONTHS; it is a constraint on the selection rather than a fourth facet,
// so it has no chip row and is validated separately.
function readIntentFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const out = {};
  window.INTENT_FACETS.forEach((facet) => {
    const raw = (params.get(facet.id) || "").split(",").map((s) => s.trim()).filter(Boolean);
    out[facet.id] = raw.filter((id) => facet.options.some((o) => o.id === id));
  });
  out.month = window.intentMonthOf({ month: (params.get("month") || "").trim() });
  return out;
}

function writeIntentToUrl(value) {
  const params = new URLSearchParams(window.location.search);
  window.INTENT_FACETS.forEach((facet) => {
    const picked = value[facet.id] || [];
    if (picked.length) params.set(facet.id, picked.join(","));
    else params.delete(facet.id);
  });
  if (value.month) params.set("month", value.month);
  else params.delete("month");
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}

function readAnswersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const out = {};
  let any = false;
  window.TRIP_QUESTIONS.forEach((q) => {
    const raw = params.get(q.id);
    if (!raw) return;
    if (q.multi) {
      const picked = raw.split(",").map((s) => s.trim())
        .filter((id) => q.options.some((o) => o.id === id));
      if (picked.length) { out[q.id] = picked; any = true; }
    } else if (q.options.some((o) => o.id === raw)) {
      out[q.id] = raw;
      any = true;
    }
  });
  return any ? out : null;
}

function writeAnswersToUrl(answers) {
  const params = new URLSearchParams(window.location.search);
  window.TRIP_QUESTIONS.forEach((q) => {
    const v = answers[q.id];
    const s = q.multi ? (v || []).join(",") : v || "";
    if (s) params.set(q.id, s);
    else params.delete(q.id);
  });
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}

// --- Filter state ------------------------------------------------------------

function useIntentFilters() {
  const [value, setValue] = useStateIn(readIntentFromUrl);

  useEffectIn(() => { writeIntentToUrl(value); }, [value]);

  const toggle = useCallbackIn((facetId, optionId) => {
    setValue((prev) => {
      const picked = prev[facetId] || [];
      const on = picked.indexOf(optionId) !== -1;
      const next = Object.assign({}, prev);
      next[facetId] = on ? picked.filter((id) => id !== optionId) : picked.concat([optionId]);
      if (window.track) {
        window.track("intent_filter", { facet: facetId, option: optionId, action: on ? "off" : "on" });
      }
      return next;
    });
  }, []);

  const clear = useCallbackIn(() => {
    const empty = { month: "" };
    window.INTENT_FACETS.forEach((f) => { empty[f.id] = []; });
    setValue(empty);
    if (window.track) window.track("intent_filter", { facet: "all", option: "", action: "clear" });
  }, []);

  // The month came from the trip selector rather than from a chip, so it needs
  // its own way off. Dropping it widens the list to the whole year without
  // disturbing the facets the reader may have tuned by hand since the hand-off.
  const clearMonth = useCallbackIn(() => {
    setValue((prev) => Object.assign({}, prev, { month: "" }));
    if (window.track) window.track("intent_filter", { facet: "month", option: "", action: "off" });
  }, []);

  // Used by the trip selector's hand-off: replace the whole selection at once.
  const apply = useCallbackIn((intent) => {
    const next = { month: window.intentMonthOf(intent) };
    window.INTENT_FACETS.forEach((f) => { next[f.id] = (intent && intent[f.id]) || []; });
    setValue(next);
  }, []);

  return { value, toggle, clear, clearMonth, apply, count: window.intentSelectionCount(value) };
}

// --- The filter bar ----------------------------------------------------------

function IntentFilters({ articles, value, onToggle, onClear, onClearMonth, count, resultCount, note }) {
  const counts = window.intentCounts(articles || window.ARTICLES, value);
  const selected = count > 0;
  const month = window.intentMonthOf(value);
  const hidden = month
    ? (articles || window.ARTICLES).filter((a) => !window.articleFitsMonth(a.slug, month)).length
    : 0;

  return (
    <div className="intentf">
      <div className="intentf__head">
        <span className="intentf__title">Narrow it down</span>
        <span className="intentf__note">
          {selected
            ? `${resultCount} ${resultCount === 1 ? "entry" : "entries"} match${note ? ". " + note : "."}`
            : "Pick a stage, a traveler, or a topic. Combine them freely."}
        </span>
        {selected && (
          <button type="button" className="intentf__clear" onClick={onClear}>
            Clear {count} filter{count === 1 ? "" : "s"}
          </button>
        )}
      </div>

      {/* The month is a constraint, not a facet: it arrives from the trip
          selector rather than from a chip, so it gets a stated row with its own
          way off instead of hiding inside the counts. Saying how many entries it
          is holding back is the point — a filter that silently shrinks the
          archive is the failure this row exists to make visible. */}
      {month && (
        <div className="intentf__row intentf__row--month">
          <span className="intentf__facet" id="intentf-month">Trip month</span>
          <div className="intentf__chips" role="group" aria-labelledby="intentf-month">
            <button
              type="button"
              className="ichip ichip--on"
              aria-pressed="true"
              title={`Seasonal entries outside ${window.intentMonthLabel(month)} are hidden`}
              onClick={onClearMonth}
            >
              {window.intentMonthLabel(month)} ×
            </button>
            <span className="intentf__month-note">
              {hidden > 0
                ? `${hidden} seasonal ${hidden === 1 ? "entry does" : "entries do"} not apply in ${window.intentMonthLabel(month)}. Drop this to see the whole year.`
                : `Nothing in the archive is ruled out by ${window.intentMonthLabel(month)}.`}
            </span>
          </div>
        </div>
      )}

      {window.INTENT_FACETS.map((facet) => (
        <div key={facet.id} className="intentf__row">
          <span className="intentf__facet" id={`intentf-${facet.id}`}>{facet.label}</span>
          <div className="intentf__chips" role="group" aria-labelledby={`intentf-${facet.id}`}>
            {facet.options.map((opt) => {
              const on = (value[facet.id] || []).indexOf(opt.id) !== -1;
              const n = counts[facet.id][opt.id];
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={"ichip" + (on ? " ichip--on" : "") + (!on && n === 0 ? " ichip--empty" : "")}
                  aria-pressed={on}
                  disabled={!on && n === 0}
                  title={opt.note || ""}
                  onClick={() => onToggle(facet.id, opt.id)}
                >
                  {opt.label}
                  <span className="ichip__n">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- The five-question trip selector ----------------------------------------

// A reader-facing link out of the plan. Internal routes go through go(); the
// itinerary link carries a query string, which go() drops by design, so it
// navigates for real (same rule as /itineraries).
function PlanLink({ href, route, go, children, target }) {
  return (
    <a
      className="tripplan__link"
      href={href}
      onClick={(e) => {
        if (window.track) window.track("cta_click", { location: "trip_selector", target: target || route || href });
        if (!route) return;
        e.preventDefault();
        go(route);
      }}
    >
      {children}
    </a>
  );
}

function TripPlan({ plan, go, onApplyIntent, matchCount }) {
  const it = plan.itinerary;
  const itinerary = (window.ITINERARIES || []).find((x) => x.id === it.id) || null;
  const stopIds = window.getItineraryStopIds ? window.getItineraryStopIds(it.id) : [];
  const product = plan.product;

  return (
    <div className="tripplan" role="region" aria-label="Your Yosemite plan">
      <div className="eyebrow eyebrow--moss">Your plan</div>
      <p className="tripplan__summary">{plan.summary}</p>

      {plan.notes.length > 0 && (
        <ul className="tripplan__notes">
          {plan.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}

      <div className="tripplan__cols">
        <div className="tripplan__col">
          <h3 className="tripplan__h">Read these, in this order</h3>
          <ol className="tripplan__reads">
            {plan.reads.map((a) => (
              <li key={a.slug}>
                <PlanLink href={`/articles/${a.slug}`} route={`a:${a.slug}`} go={go} target={a.slug}>
                  {a.title}
                </PlanLink>
                <span className="tripplan__read-meta">{a.read}</span>
              </li>
            ))}
          </ol>
          {matchCount > plan.reads.length && (
            <button
              type="button"
              className="tripplan__more"
              onClick={() => {
                if (window.track) window.track("trip_selector_apply_filters", { matches: String(matchCount) });
                onApplyIntent(plan.intent);
              }}
            >
              Show all {matchCount} entries that fit this trip ↓
            </button>
          )}
        </div>

        <div className="tripplan__col">
          <h3 className="tripplan__h">The days</h3>
          {itinerary ? (
            <div className="tripplan__card">
              <div className="tripplan__card-eyebrow">{itinerary.label}</div>
              <p className="tripplan__card-title">{itinerary.title}</p>
              <p className="tripplan__card-body">{itinerary.dek}</p>
              {it.capped && <p className="tripplan__card-flag">Shortened for the season, not for your dates.</p>}
              <a
                className="btn btn--ghost"
                href={`/map?trip=${stopIds.join(",")}`}
                onClick={() => { if (window.track) window.track("cta_click", { location: "trip_selector", target: "map_trip" }); }}
              >
                Open these stops on the map →
              </a>
            </div>
          ) : (
            <div className="tripplan__card">
              <p className="tripplan__card-body">The curated day plans live on the itineraries page.</p>
              <PlanLink href="/itineraries" route="itineraries" go={go}>See the itineraries →</PlanLink>
            </div>
          )}

          <h3 className="tripplan__h" style={{ marginTop: 28 }}>Where this gets paid help</h3>
          <div className="tripplan__card tripplan__card--product">
            <p className="tripplan__card-title">{product.title}</p>
            <p className="tripplan__card-body">{product.body}</p>
            <PlanLink href={`/${product.route}`} route={product.route} go={go} target={product.key}>
              {product.cta} →
            </PlanLink>
            {product.secondary && (
              <p className="tripplan__card-alt">
                <PlanLink href={`/${product.secondary.route}`} route={product.secondary.route} go={go} target={product.secondary.route}>
                  {product.secondary.label}
                </PlanLink>
              </p>
            )}
          </div>
        </div>
      </div>

      {plan.lodging && window.LodgingCta && (
        <window.LodgingCta
          destination={plan.lodging.destination}
          heading={plan.lodging.heading}
          note={plan.lodging.note}
          cta={plan.lodging.cta}
          list="trip_selector"
          slug="trip-selector"
        />
      )}
    </div>
  );
}

function TripSelector({ go, onApplyIntent }) {
  const [answers, setAnswers] = useStateIn(() => {
    const fromUrl = readAnswersFromUrl();
    if (fromUrl) return fromUrl;
    const stored = window.safeStorage.get(TRIP_ANSWERS_KEY, null);
    if (!stored) return {};
    try {
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  });
  const [open, setOpen] = useStateIn(true);

  useEffectIn(() => {
    writeAnswersToUrl(answers);
    if (Object.keys(answers).length) window.safeStorage.set(TRIP_ANSWERS_KEY, JSON.stringify(answers));
    else window.safeStorage.remove(TRIP_ANSWERS_KEY);
  }, [answers]);

  const complete = window.tripAnswersComplete(answers);

  useEffectIn(() => {
    if (complete && window.track) window.track("trip_selector_complete", {});
  }, [complete]);

  const pick = (question, optionId) => {
    setAnswers((prev) => {
      const next = Object.assign({}, prev);
      if (!question.multi) {
        // Tapping the chosen answer again clears it, so a misclick is one tap
        // to undo rather than a state you cannot leave.
        if (prev[question.id] === optionId) delete next[question.id];
        else next[question.id] = optionId;
      } else {
        const picked = prev[question.id] || [];
        const on = picked.indexOf(optionId) !== -1;
        let list = on ? picked.filter((id) => id !== optionId) : picked.concat([optionId]);
        // "Just adults, no constraints" is the absence of the others, so it and
        // the rest of the list cannot both be true.
        if (!on && optionId === "just-us") list = ["just-us"];
        else if (!on) list = list.filter((id) => id !== "just-us");
        if (list.length) next[question.id] = list;
        else delete next[question.id];
      }
      return next;
    });
    if (window.track) window.track("trip_selector_answer", { question: question.id, answer: optionId });
  };

  const answered = window.TRIP_QUESTIONS.filter((q) => {
    const v = answers[q.id];
    return q.multi ? Array.isArray(v) && v.length > 0 : Boolean(v);
  }).length;

  const plan = complete ? window.buildTripPlan(answers) : null;
  const matchCount = plan ? window.filterArticlesByIntent(window.ARTICLES, plan.intent).length : 0;

  return (
    <section className="tripsel" aria-label="Trip selector">
      <div className="tripsel__head">
        <div>
          <div className="eyebrow eyebrow--moss">Start here</div>
          <h2 className="tripsel__title">Five questions, then a plan.</h2>
          <p className="tripsel__dek">
            Answer these and this page stops being an archive. You get the handful of entries that apply to your trip, the day plan the season actually allows, and an honest read on whether you need anything paid.
          </p>
        </div>
        <button
          type="button"
          className="tripsel__toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide the questions" : "Show the questions"}
        </button>
      </div>

      {open && (
        <ol className="tripsel__qs">
          {window.TRIP_QUESTIONS.map((q, i) => {
            const v = answers[q.id];
            const isOn = (id) => (q.multi ? (v || []).indexOf(id) !== -1 : v === id);
            return (
              <li key={q.id} className="tripsel__q">
                <div className="tripsel__q-head">
                  <span className="tripsel__q-num">{i + 1}</span>
                  <span className="tripsel__q-label" id={`tripsel-${q.id}`}>{q.label}</span>
                </div>
                <p className="tripsel__q-hint">{q.hint}</p>
                <div className="tripsel__opts" role="group" aria-labelledby={`tripsel-${q.id}`}>
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={"ichip" + (isOn(opt.id) ? " ichip--on" : "")}
                      aria-pressed={isOn(opt.id)}
                      title={opt.note || ""}
                      onClick={() => pick(q, opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="tripsel__bar">
        <span className="tripsel__progress">
          {complete ? "All five answered." : `${answered} of 5 answered. The plan appears when all five are.`}
        </span>
        {answered > 0 && (
          <button type="button" className="tripsel__reset" onClick={() => setAnswers({})}>
            Start over
          </button>
        )}
      </div>

      {plan && (
        <TripPlan plan={plan} go={go} onApplyIntent={onApplyIntent} matchCount={matchCount} />
      )}
    </section>
  );
}

window.IntentFilters = IntentFilters;
window.TripSelector = TripSelector;
window.useIntentFilters = useIntentFilters;
