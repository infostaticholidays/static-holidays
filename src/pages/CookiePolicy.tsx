
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. What are cookies?",
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
    title: "2. Who we are",
    content: (
      <>
        <p>
          Static Holidays is a third-party holiday accommodation platform
          that helps guests discover properties and connect with property
          owners or hosts. Static Holidays does not own or manage every
          property listed on the platform.
        </p>
        <p>
          If you have questions about this policy, contact us at{" "}
          <a
            href="mailto:infostaticholidays@gmail.com"
            className="font-medium text-[#286442] underline decoration-[#286442]/40 underline-offset-4 hover:decoration-[#286442]"
          >
            infostaticholidays@gmail.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "3. Types of cookies and similar technologies",
    content: (
      <>
        <p>
          Depending on the features enabled on our website, cookies and
          similar technologies may fall into these categories:
        </p>
        <ul className="list-disc space-y-3 pl-6 marker:text-[#286442]">
          <li>
            <strong className="text-[#1d472f]">Strictly necessary:</strong>{" "}
            Support essential website functions, such as security and
            navigation.
          </li>
          <li>
            <strong className="text-[#1d472f]">Preferences:</strong>{" "}
            Remember choices you make, where that functionality is available.
          </li>
          <li>
            <strong className="text-[#1d472f]">Analytics:</strong>{" "}
            Help us understand how visitors use the website, where enabled
            and permitted.
          </li>
          <li>
            <strong className="text-[#1d472f]">Advertising and marketing:</strong>{" "}
            May measure campaigns or support relevant advertising if these
            technologies are introduced.
          </li>
        </ul>
        <p>
          These are possible categories, not confirmation that Static
          Holidays currently uses every type. Our actual technologies should
          be identified and documented.
        </p>
      </>
    ),
  },
  {
    title: "4. How we use cookies",
    content: (
      <>
        <p>Where applicable, cookies and similar technologies may help us:</p>
        <ul className="list-disc space-y-2 pl-6 marker:text-[#286442]">
          <li>Keep essential website features working.</li>
          <li>Protect the website against misuse and security threats.</li>
          <li>Remember preferences and cookie consent choices.</li>
          <li>Measure website performance where enabled and permitted.</li>
          <li>Support permitted marketing activities if introduced.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Your consent and cookie choices",
    content: (
      <>
        <p>
          We will seek consent before using cookies or similar technologies
          that require it under applicable UK law. Strictly necessary
          technologies may be used without consent where the relevant legal
          exemption applies.
        </p>
        <p>
          Where a cookie preference tool is available, you can use it to
          accept or reject optional categories and change your choices later.
          Rejecting optional cookies should not prevent you from using
          features that do not depend on them.
        </p>
        <p>
          Simply continuing to browse the website does not, by itself,
          constitute consent to technologies that require consent.
        </p>
      </>
    ),
  },
  {
    title: "6. Third-party cookies",
    content: (
      <p>
        Some website features or service providers may use their own
        technologies. If enabled, these may allow third parties to receive
        information in accordance with their role and applicable privacy
        terms. We should identify relevant third parties and explain their
        purposes where required.
      </p>
    ),
  },
  {
    title: "7. How long cookies remain on your device",
    content: (
      <p>
        Session cookies generally expire when you close your browser.
        Persistent cookies remain for a specified period or until deleted.
        Their duration depends on the individual technology and its purpose.
        We should document the actual cookies and their expiry periods in
        our cookie list.
      </p>
    ),
  },
  {
    title: "8. Managing cookies through your browser",
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
    title: "9. Personal data and privacy",
    content: (
      <p>
        Information collected through cookies may constitute personal data.
        Where applicable, our handling of that information is explained in
        our{" "}
        <Link
          to="/privacy-policy"
          className="font-medium text-[#286442] underline decoration-[#286442]/40 underline-offset-4 hover:decoration-[#286442]"
        >
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    title: "10. Changes to this policy",
    content: (
      <p>
        We may update this policy when our website, technologies or legal
        obligations change. The latest version will be published on this
        page with an updated review date.
      </p>
    ),
  },
  {
    title: "11. Contact us",
    content: (
      <p>
        If you have questions about our use of cookies or similar
        technologies, email{" "}
        <a
          href="mailto:infostaticholidays@gmail.com"
          className="font-medium text-[#286442] underline decoration-[#286442]/40 underline-offset-4 hover:decoration-[#286442]"
        >
          infostaticholidays@gmail.com
        </a>
        .
      </p>
    ),
  },
];

const relatedPolicies = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Booking Terms", to: "/booking-terms" },
  { label: "Cancellation Policy", to: "/cancellation-policy" },
  { label: "Travel Insurance", to: "/travel-insurance" },
  { label: "Contact Us", to: "/contact" },
];

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-[#edf4ed] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#286442] transition hover:text-[#1d472f]"
        >
          <span aria-hidden="true">←</span>
          Back to home
        </Link>

        {/* Page heading */}
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-[#286442] px-6 py-10 text-white shadow-sm sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5"
          />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90">
              <span aria-hidden="true">♧</span>
              Static Holidays
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Cookie Policy
            </h1>

            <p className="max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              A clear guide to cookies, your privacy and the choices available
              when you visit Static Holidays.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-white/75">
              <span aria-hidden="true">↻</span>
              Last updated: 20 October 2026
            </div>
          </div>
        </header>

        {/* Introduction */}
        <div className="mb-6 rounded-2xl border border-[#d8e5d8] bg-white p-5 sm:p-6">
          <p className="leading-7 text-gray-700">
            We want you to feel confident when using Static Holidays. This
            policy explains how cookies and similar technologies may be used,
            why they matter and how you can manage your choices.
          </p>
        </div>

        {/* Policy sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-[#d8e5d8] bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-8"
            >
              <h2 className="mb-4 border-l-4 border-[#286442] pl-4 text-lg font-bold leading-snug text-[#1d472f] sm:text-xl">
                {section.title}
              </h2>

              <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Related pages */}
        <section className="mt-8 rounded-2xl border border-[#d8e5d8] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-2 text-xl font-bold text-[#1d472f]">
            Related policies
          </h2>
          <p className="mb-5 text-sm leading-6 text-gray-600">
            Find more information about using Static Holidays.
          </p>

          <div className="flex flex-wrap gap-3">
            {relatedPolicies.map((policy) => (
              <Link
                key={policy.to}
                to={policy.to}
                className="inline-flex items-center rounded-full border border-[#d8e5d8] bg-[#edf4ed] px-4 py-2 text-sm font-medium text-[#286442] transition hover:border-[#286442] hover:bg-[#286442] hover:text-white"
              >
                {policy.label}
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact strip */}
        <div className="mt-6 rounded-2xl bg-[#1d472f] p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div>
            <h2 className="text-lg font-bold">Have a question?</h2>
            <p className="mt-1 text-sm leading-6 text-white/75">
              We’re happy to help with questions about this policy.
            </p>
          </div>

          <a
            href="mailto:infostaticholidays@gmail.com"
            className="mt-4 inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1d472f] transition hover:bg-[#edf4ed] sm:mt-0"
          >
            Contact Static Holidays
          </a>
        </div>
      </div>
    </main>
  );
}
