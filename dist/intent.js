var {
  useState: useStateIn,
  useEffect: useEffectIn,
  useCallback: useCallbackIn
} = React;
var TRIP_ANSWERS_KEY = "tfg.trip.selector";
function readIntentFromUrl() {
  var params = new URLSearchParams(window.location.search);
  var out = {};
  window.INTENT_FACETS.forEach(facet => {
    var raw = (params.get(facet.id) || "").split(",").map(s => s.trim()).filter(Boolean);
    out[facet.id] = raw.filter(id => facet.options.some(o => o.id === id));
  });
  out.month = window.intentMonthOf({
    month: (params.get("month") || "").trim()
  });
  return out;
}
function writeIntentToUrl(value) {
  var params = new URLSearchParams(window.location.search);
  window.INTENT_FACETS.forEach(facet => {
    var picked = value[facet.id] || [];
    if (picked.length) params.set(facet.id, picked.join(","));else params.delete(facet.id);
  });
  if (value.month) params.set("month", value.month);else params.delete("month");
  var qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}
function readAnswersFromUrl() {
  var params = new URLSearchParams(window.location.search);
  var out = {};
  var any = false;
  window.TRIP_QUESTIONS.forEach(q => {
    var raw = params.get(q.id);
    if (!raw) return;
    if (q.multi) {
      var picked = raw.split(",").map(s => s.trim()).filter(id => q.options.some(o => o.id === id));
      if (picked.length) {
        out[q.id] = picked;
        any = true;
      }
    } else if (q.options.some(o => o.id === raw)) {
      out[q.id] = raw;
      any = true;
    }
  });
  return any ? out : null;
}
function writeAnswersToUrl(answers) {
  var params = new URLSearchParams(window.location.search);
  window.TRIP_QUESTIONS.forEach(q => {
    var v = answers[q.id];
    var s = q.multi ? (v || []).join(",") : v || "";
    if (s) params.set(q.id, s);else params.delete(q.id);
  });
  var qs = params.toString();
  window.history.replaceState(window.history.state, "", window.location.pathname + (qs ? "?" + qs : ""));
}
function useIntentFilters() {
  var [value, setValue] = useStateIn(readIntentFromUrl);
  useEffectIn(() => {
    writeIntentToUrl(value);
  }, [value]);
  var toggle = useCallbackIn((facetId, optionId) => {
    setValue(prev => {
      var picked = prev[facetId] || [];
      var on = picked.indexOf(optionId) !== -1;
      var next = Object.assign({}, prev);
      next[facetId] = on ? picked.filter(id => id !== optionId) : picked.concat([optionId]);
      if (window.track) {
        window.track("intent_filter", {
          facet: facetId,
          option: optionId,
          action: on ? "off" : "on"
        });
      }
      return next;
    });
  }, []);
  var clear = useCallbackIn(() => {
    var empty = {
      month: ""
    };
    window.INTENT_FACETS.forEach(f => {
      empty[f.id] = [];
    });
    setValue(empty);
    if (window.track) window.track("intent_filter", {
      facet: "all",
      option: "",
      action: "clear"
    });
  }, []);
  var clearMonth = useCallbackIn(() => {
    setValue(prev => Object.assign({}, prev, {
      month: ""
    }));
    if (window.track) window.track("intent_filter", {
      facet: "month",
      option: "",
      action: "off"
    });
  }, []);
  var apply = useCallbackIn(intent => {
    var next = {
      month: window.intentMonthOf(intent)
    };
    window.INTENT_FACETS.forEach(f => {
      next[f.id] = intent && intent[f.id] || [];
    });
    setValue(next);
  }, []);
  return {
    value,
    toggle,
    clear,
    clearMonth,
    apply,
    count: window.intentSelectionCount(value)
  };
}
function IntentFilters({
  articles,
  value,
  onToggle,
  onClear,
  onClearMonth,
  count,
  resultCount,
  note
}) {
  var counts = window.intentCounts(articles || window.ARTICLES, value);
  var selected = count > 0;
  var month = window.intentMonthOf(value);
  var hidden = month ? (articles || window.ARTICLES).filter(a => !window.articleFitsMonth(a.slug, month)).length : 0;
  return React.createElement("div", {
    className: "intentf"
  }, React.createElement("div", {
    className: "intentf__head"
  }, React.createElement("span", {
    className: "intentf__title"
  }, "Narrow it down"), React.createElement("span", {
    className: "intentf__note"
  }, selected ? `${resultCount} ${resultCount === 1 ? "entry" : "entries"} match${note ? ". " + note : "."}` : "Pick a stage, a traveler, or a topic. Combine them freely."), selected && React.createElement("button", {
    type: "button",
    className: "intentf__clear",
    onClick: onClear
  }, "Clear ", count, " filter", count === 1 ? "" : "s")), month && React.createElement("div", {
    className: "intentf__row intentf__row--month"
  }, React.createElement("span", {
    className: "intentf__facet",
    id: "intentf-month"
  }, "Trip month"), React.createElement("div", {
    className: "intentf__chips",
    role: "group",
    "aria-labelledby": "intentf-month"
  }, React.createElement("button", {
    type: "button",
    className: "ichip ichip--on",
    "aria-pressed": "true",
    title: `Seasonal entries outside ${window.intentMonthLabel(month)} are hidden`,
    onClick: onClearMonth
  }, window.intentMonthLabel(month), " ×"), React.createElement("span", {
    className: "intentf__month-note"
  }, hidden > 0 ? `${hidden} seasonal ${hidden === 1 ? "entry does" : "entries do"} not apply in ${window.intentMonthLabel(month)}. Drop this to see the whole year.` : `Nothing in the archive is ruled out by ${window.intentMonthLabel(month)}.`))), window.INTENT_FACETS.map(facet => React.createElement("div", {
    key: facet.id,
    className: "intentf__row"
  }, React.createElement("span", {
    className: "intentf__facet",
    id: `intentf-${facet.id}`
  }, facet.label), React.createElement("div", {
    className: "intentf__chips",
    role: "group",
    "aria-labelledby": `intentf-${facet.id}`
  }, facet.options.map(opt => {
    var on = (value[facet.id] || []).indexOf(opt.id) !== -1;
    var n = counts[facet.id][opt.id];
    return React.createElement("button", {
      key: opt.id,
      type: "button",
      className: "ichip" + (on ? " ichip--on" : "") + (!on && n === 0 ? " ichip--empty" : ""),
      "aria-pressed": on,
      disabled: !on && n === 0,
      title: opt.note || "",
      onClick: () => onToggle(facet.id, opt.id)
    }, opt.label, React.createElement("span", {
      className: "ichip__n"
    }, n));
  })))));
}
function PlanLink({
  href,
  route,
  go,
  children,
  target
}) {
  return React.createElement("a", {
    className: "tripplan__link",
    href: href,
    onClick: e => {
      if (window.track) window.track("cta_click", {
        location: "trip_selector",
        target: target || route || href
      });
      if (!route) return;
      e.preventDefault();
      go(route);
    }
  }, children);
}
function TripPlan({
  plan,
  go,
  onApplyIntent,
  matchCount
}) {
  var it = plan.itinerary;
  var itinerary = (window.ITINERARIES || []).find(x => x.id === it.id) || null;
  var stopIds = window.getItineraryStopIds ? window.getItineraryStopIds(it.id) : [];
  var product = plan.product;
  return React.createElement("div", {
    className: "tripplan",
    role: "region",
    "aria-label": "Your Yosemite plan"
  }, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Your plan"), React.createElement("p", {
    className: "tripplan__summary"
  }, plan.summary), plan.notes.length > 0 && React.createElement("ul", {
    className: "tripplan__notes"
  }, plan.notes.map((n, i) => React.createElement("li", {
    key: i
  }, n))), React.createElement("div", {
    className: "tripplan__cols"
  }, React.createElement("div", {
    className: "tripplan__col"
  }, React.createElement("h3", {
    className: "tripplan__h"
  }, "Read these, in this order"), React.createElement("ol", {
    className: "tripplan__reads"
  }, plan.reads.map(a => React.createElement("li", {
    key: a.slug
  }, React.createElement(PlanLink, {
    href: `/articles/${a.slug}`,
    route: `a:${a.slug}`,
    go: go,
    target: a.slug
  }, a.title), React.createElement("span", {
    className: "tripplan__read-meta"
  }, a.read)))), matchCount > plan.reads.length && React.createElement("button", {
    type: "button",
    className: "tripplan__more",
    onClick: () => {
      if (window.track) window.track("trip_selector_apply_filters", {
        matches: String(matchCount)
      });
      onApplyIntent(plan.intent);
    }
  }, "Show all ", matchCount, " entries that fit this trip ↓")), React.createElement("div", {
    className: "tripplan__col"
  }, React.createElement("h3", {
    className: "tripplan__h"
  }, "The days"), itinerary ? React.createElement("div", {
    className: "tripplan__card"
  }, React.createElement("div", {
    className: "tripplan__card-eyebrow"
  }, itinerary.label), React.createElement("p", {
    className: "tripplan__card-title"
  }, itinerary.title), React.createElement("p", {
    className: "tripplan__card-body"
  }, itinerary.dek), it.capped && React.createElement("p", {
    className: "tripplan__card-flag"
  }, "Shortened for the season, not for your dates."), React.createElement("a", {
    className: "btn btn--ghost",
    href: `/map?trip=${stopIds.join(",")}`,
    onClick: () => {
      if (window.track) window.track("cta_click", {
        location: "trip_selector",
        target: "map_trip"
      });
    }
  }, "Open these stops on the map →")) : React.createElement("div", {
    className: "tripplan__card"
  }, React.createElement("p", {
    className: "tripplan__card-body"
  }, "The curated day plans live on the itineraries page."), React.createElement(PlanLink, {
    href: "/itineraries",
    route: "itineraries",
    go: go
  }, "See the itineraries →")), React.createElement("h3", {
    className: "tripplan__h",
    style: {
      marginTop: 28
    }
  }, "Where this gets paid help"), React.createElement("div", {
    className: "tripplan__card tripplan__card--product"
  }, React.createElement("p", {
    className: "tripplan__card-title"
  }, product.title), React.createElement("p", {
    className: "tripplan__card-body"
  }, product.body), React.createElement(PlanLink, {
    href: `/${product.route}`,
    route: product.route,
    go: go,
    target: product.key
  }, product.cta, " →"), product.secondary && React.createElement("p", {
    className: "tripplan__card-alt"
  }, React.createElement(PlanLink, {
    href: `/${product.secondary.route}`,
    route: product.secondary.route,
    go: go,
    target: product.secondary.route
  }, product.secondary.label))))), plan.lodging && window.LodgingCta && React.createElement(window.LodgingCta, {
    destination: plan.lodging.destination,
    heading: plan.lodging.heading,
    note: plan.lodging.note,
    cta: plan.lodging.cta,
    list: "trip_selector",
    slug: "trip-selector"
  }));
}
function TripSelector({
  go,
  onApplyIntent
}) {
  var [answers, setAnswers] = useStateIn(() => {
    var fromUrl = readAnswersFromUrl();
    if (fromUrl) return fromUrl;
    var stored = window.safeStorage.get(TRIP_ANSWERS_KEY, null);
    if (!stored) return {};
    try {
      var parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  });
  var [open, setOpen] = useStateIn(true);
  useEffectIn(() => {
    writeAnswersToUrl(answers);
    if (Object.keys(answers).length) window.safeStorage.set(TRIP_ANSWERS_KEY, JSON.stringify(answers));else window.safeStorage.remove(TRIP_ANSWERS_KEY);
  }, [answers]);
  var complete = window.tripAnswersComplete(answers);
  useEffectIn(() => {
    if (complete && window.track) window.track("trip_selector_complete", {});
  }, [complete]);
  var pick = (question, optionId) => {
    setAnswers(prev => {
      var next = Object.assign({}, prev);
      if (!question.multi) {
        if (prev[question.id] === optionId) delete next[question.id];else next[question.id] = optionId;
      } else {
        var picked = prev[question.id] || [];
        var on = picked.indexOf(optionId) !== -1;
        var list = on ? picked.filter(id => id !== optionId) : picked.concat([optionId]);
        if (!on && optionId === "just-us") list = ["just-us"];else if (!on) list = list.filter(id => id !== "just-us");
        if (list.length) next[question.id] = list;else delete next[question.id];
      }
      return next;
    });
    if (window.track) window.track("trip_selector_answer", {
      question: question.id,
      answer: optionId
    });
  };
  var answered = window.TRIP_QUESTIONS.filter(q => {
    var v = answers[q.id];
    return q.multi ? Array.isArray(v) && v.length > 0 : Boolean(v);
  }).length;
  var plan = complete ? window.buildTripPlan(answers) : null;
  var matchCount = plan ? window.filterArticlesByIntent(window.ARTICLES, plan.intent).length : 0;
  return React.createElement("section", {
    className: "tripsel",
    "aria-label": "Trip selector"
  }, React.createElement("div", {
    className: "tripsel__head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "eyebrow eyebrow--moss"
  }, "Start here"), React.createElement("h2", {
    className: "tripsel__title"
  }, "Five questions, then a plan."), React.createElement("p", {
    className: "tripsel__dek"
  }, "Answer these and this page stops being an archive. You get the handful of entries that apply to your trip, the day plan the season actually allows, and an honest read on whether you need anything paid.")), React.createElement("button", {
    type: "button",
    className: "tripsel__toggle",
    "aria-expanded": open,
    onClick: () => setOpen(v => !v)
  }, open ? "Hide the questions" : "Show the questions")), open && React.createElement("ol", {
    className: "tripsel__qs"
  }, window.TRIP_QUESTIONS.map((q, i) => {
    var v = answers[q.id];
    var isOn = id => q.multi ? (v || []).indexOf(id) !== -1 : v === id;
    return React.createElement("li", {
      key: q.id,
      className: "tripsel__q"
    }, React.createElement("div", {
      className: "tripsel__q-head"
    }, React.createElement("span", {
      className: "tripsel__q-num"
    }, i + 1), React.createElement("span", {
      className: "tripsel__q-label",
      id: `tripsel-${q.id}`
    }, q.label)), React.createElement("p", {
      className: "tripsel__q-hint"
    }, q.hint), React.createElement("div", {
      className: "tripsel__opts",
      role: "group",
      "aria-labelledby": `tripsel-${q.id}`
    }, q.options.map(opt => React.createElement("button", {
      key: opt.id,
      type: "button",
      className: "ichip" + (isOn(opt.id) ? " ichip--on" : ""),
      "aria-pressed": isOn(opt.id),
      title: opt.note || "",
      onClick: () => pick(q, opt.id)
    }, opt.label))));
  })), React.createElement("div", {
    className: "tripsel__bar"
  }, React.createElement("span", {
    className: "tripsel__progress"
  }, complete ? "All five answered." : `${answered} of 5 answered. The plan appears when all five are.`), answered > 0 && React.createElement("button", {
    type: "button",
    className: "tripsel__reset",
    onClick: () => setAnswers({})
  }, "Start over")), plan && React.createElement(TripPlan, {
    plan: plan,
    go: go,
    onApplyIntent: onApplyIntent,
    matchCount: matchCount
  }));
}
window.IntentFilters = IntentFilters;
window.TripSelector = TripSelector;
window.useIntentFilters = useIntentFilters;
