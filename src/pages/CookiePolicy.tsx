
import { Link } from "react-router-dom";

const sections = [
  {
    title: "What are cookies?",
    number: "01",
    content: (
      <p>
        Cookies are small text files stored on your device when you visit a
        website. Similar technologies, including local storage and tracking
        technologies, may also store or access information on your device.
        They can help websites operate securely, remember preferences and
        understand how visitors use a service.
      </p>
    ),
  },
  {
    title: "Who we are",
    number: "02",
    content: (
      <>
        <p>
          Static Holidays is a third-party holiday accommodation platform
          that helps guests discover properties and connect with property
          owners or hosts. Static Holidays does not own or manage every
          property listed on the platform.
        </p>
        <p>
          Questions about this policy? Email{" "}
          <a
            className="font-semibold text-[#286442] underline underline-offset-4"
            href="mailto:infostaticholidays@gmail.com"
          >
            infostaticholidays@gmail.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Types of cookies",
    number: "03",
    content: (
      <>
        <p>
          Depending on the features enabled on our website, cookies and
          similar technologies may include:
        </p>
        <ul className="list-disc space-y-3 pl-5 marker:text-[#286442]">
          <li><strong className="text-[#1d472f]">Strictly necessary:</strong> Support essential functions such as security and navigation.</li>
          <li><strong className="text-[#1d472f]">Preferences:</strong> Remember choices you make, where available.</li>
          <li><strong className="text-[#1d472f]">Analytics:</strong> Help us understand website usage, where enabled and permitted.</li>
          <li><strong className="text-[#1d472f]">Marketing:</strong> May measure campaigns or support advertising if introduced.</li>
        </ul>
        <p>
          These are possible categories, not confirmation that we currently
          use every type. Our actual technologies should be identified and
          documented.
        </p>
      </>
    ),
  },
  {
    title: "How we use cookies",
    number: "04",
    content: (
      <>
        <p>Where applicable, cookies may help us:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-[#286442]">
          <li>Keep essential website features working.</li>
          <li>Protect the website against misuse and security threats.</li>
          <li>Remember preferences and consent choices.</li>
          <li>Measure performance where enabled and permitted.</li>
          <li>Support permitted marketing activities if introduced.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Your consent and choices",
    number: "05",
    content: (
      <>
        <p>
          We will seek consent before using cookies or similar technologies
          that require it under applicable UK law. Strictly necessary
          technologies may be used without consent where the relevant
          exemption applies.
        </p>
        <p>
          Where a cookie preference tool is available, you can accept or
          reject optional categories and change your choices later. Simply
          continuing to browse does not, by itself, constitute consent to
          technologies that require consent.
        </p>
      </>
    ),
  },
  {
    title: "Third-party cookies",
    number: "06",
    content: (
      <p>
        Some website features or service providers may use their own
        technologies. Where enabled, these may allow third parties to receive
        information under their applicable privacy terms. Relevant third
        parties and their purposes should be identified where required.
      </p>
    ),
  },
  {
    title: "How long cookies last",
    number: "07",
    content: (
      <p>
        Session cookies generally expire when you close your browser.
        Persistent cookies remain for a specified period or until deleted.
        Their duration depends on the technology and its purpose. Our actual
        cookie list should document the technologies used and their expiry
        periods.
      </p>
    ),
  },
  {
    title: "Managing cookies in your browser",
    number: "08",
    content: (
      <p>
        Most browsers allow you to view, delete or block cookies through
        their settings. Blocking all cookies may affect some website
        functionality. Browser controls do not replace any consent choices
        you need to make through our website.
      </p>
    ),
  },
  {
    title: "Personal data and privacy",
    number: "09",
    content: (
      <p>
        Information collected through cookies may constitute personal data.
        Read our{" "}
        <Link
          to="/privacy-policy"
          className="font-semibold text-[#286442] underline underline-offset-4"
        >
          Privacy Policy
        </Link>{" "}
        for further information about how applicable personal data is
        handled.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    number: "10",
    content: (
      <p>
        We may update this policy when our website, technologies or legal
        obligations change. The latest version will appear on this page with
        an updated review date.
      </p>
    ),
  },
  {
    title: "Contact us",
    number: "11",
    content: (
      <p>
        For questions about cookies or similar technologies, contact us at{" "}
        <a
          href="mailto:infostaticholidays@gmail.com"
          className="font-semibold text-[#286442] underline underline-offset-4"
        >
          infostaticholidays@gmail.com
        </a>
        .
      </p>
    ),
  },
];

const relatedLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Booking Terms", to: "/booking-terms" },
  { label: "Cancellation Policy", to: "/cancellation-policy" },
  { label: "Travel Insurance", to: "/travel-insurance" },
  { label: "Contact Us", to: "/contact" },
];

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-[#edf4ed] text-[#26352b]">
      {/* Branded hero */}
      <section className="relative overflow-hidden bg-[#1d472f]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[48px] border-white/[0.06]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 right-1/4 h-64 w-64 rounded-full bg-[#286442]/50 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <span aria-hidden="true">←</span> Back to home
          </Link>

          <div className="mt-12 max-w-3xl sm:mt-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#b7d6a8]" />
              Static Holidays
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Cookie Policy
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Your privacy matters. Learn how cookies work, how they may be
              used on our website, and how you can manage your choices.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm text-white/65">
              <span aria-hidden="true">◷</span>
              Last updated: 20 October 2026
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl border border-[#d8e5d8] bg-white p-5 shadow-sm">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#286442]">
                On this page
              </p>
              <nav className="space-y-1">
                {sections.map((section, index) => (
                  <a
                    key={section.number}
                    href={`#cookie-section-${section.number}`}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-[#edf4ed] hover:text-[#1d472f]"
                  >
                    <span className="mr-2 text-xs font-semibold text-[#73927b]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy cards */}
          <div className="min-w-0">
            <div className="mb-6 rounded-2xl border border-[#d8e5d8] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#286442]">
                Your privacy
              </div>
              <p className="text-sm leading-7 text-gray-600 sm:text-base">
                We want you to feel confident when using Static Holidays.
                This policy explains how cookies and similar technologies
                may be used, why they matter and how you can manage your
                choices.
              </p>
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <section
                  key={section.number}
                  id={`cookie-section-${section.number}`}
                  className="scroll-mt-8 rounded-2xl border border-[#d8e5d8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ed] text-sm font-bold text-[#286442]">
                      {section.number}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="mb-4 text-lg font-bold tracking-tight text-[#1d472f] sm:text-xl">
                        {section.title}
                      </h2>
                      <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Related policies */}
            <section className="mt-8 rounded-2xl border border-[#d8e5d8] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-[#1d472f]">
                Explore more
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Find the information you need for your stay or property.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {relatedLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-full border border-[#d5e4d5] bg-[#edf4ed] px-4 py-2.5 text-sm font-semibold text-[#286442] transition hover:border-[#286442] hover:bg-[#286442] hover:text-white"
                  >
                    {item.label} <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Contact banner */}
            <section className="mt-6 overflow-hidden rounded-2xl bg-[#286442] p-6 text-white sm:p-8">
              <div className="sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                    Need help?
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    We're here to help.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    Get in touch if you have questions about this policy.
                  </p>
                </div>
                <a
                  href="mailto:infostaticholidays@gmail.com"
                  className="mt-5 inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1d472f] transition hover:bg-[#edf4ed] sm:mt-0"
                >
                  Contact us <span className="ml-2" aria-hidden="true">→</span>
                </a>
              </div>
            </section>

            <p className="mt-8 text-center text-xs leading-6 text-[#607466]">
              © {new Date().getFullYear()} Static Holidays. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

