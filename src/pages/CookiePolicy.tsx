
import { Link } from "react-router-dom";

export default function CookiePolicy() {
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
              className="text-[#286442] underline"
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
            similar technologies may fall into the following categories:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Strictly necessary:</strong> These support essential
              website functions, such as security, navigation or maintaining a
              requested session.
            </li>
            <li>
              <strong>Preferences:</strong> These remember choices you make,
              where such functionality is available.
            </li>
            <li>
              <strong>Analytics:</strong> These can help us understand how
              visitors use the website and identify areas for improvement.
            </li>
            <li>
              <strong>Advertising and marketing:</strong> These may be used to
              measure campaigns or provide relevant advertising if such
              technologies are implemented.
            </li>
          </ul>
          <p>
            These are categories of technology, not a confirmation that
            Static Holidays currently uses every category. The technologies
            actually used on our website must be identified and documented.
          </p>
        </>
      ),
    },
    {
      title: "4. How we use cookies",
      content: (
        <>
          <p>Where applicable, cookies and similar technologies may be used to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Keep essential website features working.</li>
            <li>Protect the website against misuse and security threats.</li>
            <li>Remember preferences and cookie consent choices.</li>
            <li>Measure website performance, where enabled and permitted.</li>
            <li>Support marketing or advertising activities, if introduced and permitted.</li>
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
          technologies. If these are enabled, the relevant third party may
          receive information in accordance with its role and applicable
          privacy terms. We will identify the third parties and explain their
          purposes where required. Their technologies will be subject to
          consent requirements where applicable.
        </p>
      ),
    },
    {
      title: "7. How long cookies remain on your device",
      content: (
        <p>
          Session cookies generally expire when you close your browser.
          Persistent cookies remain for a specified period or until deleted.
          The duration depends on the individual technology and its purpose.
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
          that you need to make through our website.
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
            className="text-[#286442] underline"
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
            className="text-[#286442] underline"
          >
            infostaticholidays@gmail.com
          </a>
          .
        </p>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#edf4ed] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-8 inline-block text-sm font-medium text-[#286442] hover:underline"
        >
          ← Back to home
        </Link>

        <header className="mb-10 rounded-2xl bg-[#286442] p-8 text-white sm:p-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/80">
            Static Holidays
          </p>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="max-w-2xl leading-7 text-white/90">
            Information about cookies and similar technologies used on the
            Static Holidays website and how you can manage your choices.
          </p>
          <p className="mt-5 text-sm text-white/80">
            Last updated: 20 October 2026
          </p>
        </header>

        <div className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-[#d8e5d8] bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="mb-4 text-xl font-semibold text-[#1d472f]">
                {section.title}
              </h2>
              <div className="space-y-4 leading-7 text-gray-700">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <nav
          aria-label="Related policies"
          className="mt-8 rounded-2xl bg-white p-6"
        >
          <h2 className="mb-4 font-semibold text-[#1d472f]">
            Related policies
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link to="/privacy-policy" className="text-[#286442] underline">
              Privacy Policy
            </Link>
            <Link to="/booking-terms" className="text-[#286442] underline">
              Booking Terms
            </Link>
            <Link
              to="/cancellation-policy"
              className="text-[#286442] underline"
            >
              Cancellation Policy
            </Link>
            <Link to="/travel-insurance" className="text-[#286442] underline">
              Travel Insurance
            </Link>
            <Link to="/contact" className="text-[#286442] underline">
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
