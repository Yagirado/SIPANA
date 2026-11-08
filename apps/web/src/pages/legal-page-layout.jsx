import Nav from "../components/nav.jsx";
import Footer from "../components/footer.jsx";

export default function LegalPageLayout({
  title,
  intro,
  sections,
  panels,
  notice,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F2] text-[#183A2E] antialiased">
      <Nav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#68756E] sm:text-base">
            {intro}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(17.5rem,1fr)] lg:items-start">
          <article
            aria-label={title}
            className="rounded-[14px] border border-[#DDE5DC] bg-white p-6 sm:p-8"
          >
            <div className="space-y-7 sm:space-y-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-base font-bold leading-6 text-[#183A2E]">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#53645B] sm:text-[15px]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </article>

          <aside
            aria-label="Ringkasan dan informasi terkait"
            className="space-y-5"
          >
            {panels.map((panel) => (
              <section
                key={panel.title}
                className={`rounded-[14px] border border-[#DDE5DC] p-6 sm:p-7 ${panel.tone === "green" ? "bg-[#E7F2E9]" : "bg-white"}`}
              >
                <h2 className="text-lg font-bold leading-6 text-[#183A2E]">
                  {panel.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#53645B]">
                  {panel.body}
                </p>
                {panel.action && (
                  <a
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1C6B4A] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
                    href={panel.action.href}
                  >
                    {panel.action.label}
                    <span aria-hidden="true">→</span>
                  </a>
                )}
              </section>
            ))}

            <p
              className="rounded-xl bg-[#FFF3DE] p-5 text-sm leading-6 text-[#75521C]"
              role="note"
            >
              {notice}
            </p>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
