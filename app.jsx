/* global React, ReactDOM, Header, Footer,
   HomePage, AboutPage, ArticlesIndex, CategoryPage, ArticlePage,
   KitPage, PlacesPage, AdvertisePage,
   NewsletterPage, ContactPage, PrivacyPage, TermsPage, AffiliatePage,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle */

const { useState, useEffect } = React;

function App() {
  const [route, setRoute] = useState(() => (window.location.hash || "#home").slice(1) || "home");

  useEffect(() => {
    const onHash = () => {
      const r = (window.location.hash || "#home").slice(1) || "home";
      setRoute(r);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (r) => {
    window.location.hash = `#${r}`;
  };

  // Tweaks
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks.palette, tweaks.density]);

  // Route resolution
  let page;
  let currentNav = "home";
  if (route === "home") {
    page = <HomePage go={go} />;
    currentNav = "home";
  } else if (route === "about") {
    page = <AboutPage go={go} />;
    currentNav = "about";
  } else if (route === "kit") {
    page = <KitPage go={go} />;
    currentNav = "kit";
  } else if (route === "places") {
    page = <PlacesPage go={go} />;
    currentNav = "places";
  } else if (route === "advertise") {
    page = <AdvertisePage go={go} />;
  } else if (route === "articles") {
    page = <ArticlesIndex go={go} />;
    currentNav = "articles";
  } else if (route.startsWith("cat:")) {
    page = <CategoryPage slug={route.slice(4)} go={go} />;
    currentNav = "articles";
  } else if (route.startsWith("a:")) {
    page = <ArticlePage slug={route.slice(2)} go={go} />;
    currentNav = "articles";
  } else if (route === "newsletter") {
    page = <NewsletterPage go={go} />;
    currentNav = "newsletter";
  } else if (route === "contact") {
    page = <ContactPage go={go} />;
    currentNav = "contact";
  } else if (route === "privacy") {
    page = <PrivacyPage />;
  } else if (route === "terms") {
    page = <TermsPage />;
  } else if (route === "affiliate") {
    page = <AffiliatePage />;
  } else {
    page = <HomePage go={go} />;
  }

  return (
    <>
      <Header current={currentNav} go={go} />
      <main key={route}>{page}</main>
      <Footer go={go} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette" subtitle="The look of every page on the site.">
          <TweakRadio
            value={tweaks.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              { value: "golden",  label: "Golden hour" },
              { value: "granite", label: "Granite" },
              { value: "sierra",  label: "Sierra" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Density" subtitle="Reading width and gutter.">
          <TweakRadio
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "airy", label: "Airy" },
              { value: "dense", label: "Dense" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
