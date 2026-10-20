
import { Link } from "react-router-dom";

export default function CookiePolicy() {
  return (
    <div className="cp-page">
      <style>{`
        .cp-page {
          --green: #286442;
          --dark-green: #1d472f;
          --pale-green: #edf4ed;
          color: #26352b;
          font-family: Inter, system-ui, sans-serif;
          line-height: 1.7;
          background: #fff;
          min-height: 100vh;
        }
        .cp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px 6%;
          border-bottom: 1px solid #e4ebe5;
        }
        .cp-brand {
          color: var(--dark-green);
          text-decoration: none;
          font-size: 1.35rem;
          font-weight: 800;
        }
        .cp-nav a:not(.cp-brand) {
          color: var(--dark-green);
          text-decoration: none;
          font-weight: 600;
        }
        .cp-hero {
          background: var(--pale-green);
          text-align: center;
          padding: 58px 20px;
        }
        .cp-hero h1 {
          color: var(--dark-green);
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.2;
          margin: 0 0 14px;
        }
        .cp-hero p {
          max-width: 680px;
          margin: 0 auto;
        }
        .cp-content {
          max-width: 850px;
          margin: 0 auto;
          padding: 42px 22px 65px;
        }
        .cp-content h2 {
          color: var(--dark-green);
          font-size: 1.35rem;
          margin-top: 34px;
          margin-bottom: 10px;
        }
        .cp-content a {
          color: var(--green);
          font-weight: 600;
        }
        .cp-note {
          background: var(--pale-green);
          border-left: 4px solid var(--green);
          border-radius: 6px;
          padding: 16px 20px;
          margin: 24px 0;
        }
        .cp-content ul {
          padding-left: 24px;
          margin: 12px 0;
          list-style: disc;
        }
        .cp-content li {
          margin-bottom: 8px;
        }
        .cp-footer {
          background: var(--dark-green);
          color: #fff;
          padding: 30px 6%;
          text-align: center;
        }
        .cp-footer p { margin: 6px 0; }
        .cp-footer a {
          color: #fff;
          text-decoration: none;
          margin: 0 8px;
        }
        .cp-footer a:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .cp-nav { padding: 16px 5%; flex-wrap: wrap; }
          .cp-content { padding: 30px 20px 45px; }
          .cp-footer a {
            display: inline-block;
            margin: 5px 8px;
          }
        }
      `}</style>

      <header className="cp-nav">
        <Link to="/" className="cp-brand">
          Static Holidays
        </Link>
        <nav>
          <Link to="/properties">Explore stays</Link>
        </nav>
      </header>

      <section className="cp-hero">
        <h1>Cookie Policy</h1>
        <p>
          A clear guide to cookies, your privacy and the choices
          available when you visit Static Holidays.
        </p>
        <p style={{ marginTop: 12, fontSize: "0.9rem", color: "#526b59" }}>
          Last updated: 20 October 2026
        </p>
      </section>

      <main className="cp-content">
        <p>
          We want you to feel confident when using Static Holidays.
          This policy explains how cookies and similar technologies
          may be used, why they matter and how you can manage your choices.
        </p>

        <div className="cp-note">
          <strong>Your privacy matters.</strong> We explain the
          possible uses of cookies below. The actual technologies
          used on our website should be identified and documented;
          not every category described here is necessarily in use.
        </div>

        <h2>1. What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when
          you visit a website. Similar technologies, including local
          storage and tracking technologies, may also store or access
          information on your device. They can help websites operate
          securely, remember preferences and understand how visitors
          use a service.
        </p>

        <h2>2. Who we are</h2>
        <p>
          Static Holidays is a third-party holiday accommodation
          platform that helps guests discover properties and connect
          with property owners or hosts. Static Holidays does not
          own or manage every property listed on the platform.
        </p>
        <p>
          If you have questions about this policy, contact us at{" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>.
        </p>

        <h2>3. Types of cookies and similar technologies</h2>
        <p>
          Depending on the features enabled on our website, cookies
          and similar technologies may fall into these categories:
        </p>
        <ul>
          <li>
            <strong>Strictly necessary:</strong> Support essential
            website functions, such as security and navigation.
          </li>
          <li>
            <strong>Preferences:</strong> Remember choices you make,
            where that functionality is available.
          </li>
          <li>
            <strong>Analytics:</strong> Help us understand how visitors
            use the website, where enabled and permitted.
          </li>
          <li>
            <strong>Advertising and marketing:</strong> May measure
            campaigns or support relevant advertising if introduced.
          </li>
        </ul>
        <p>
          These are possible categories, not confirmation that Static
          Holidays currently uses every type. Our actual technologies
          should be identified and documented.
        </p>

        <h2>4. How we use cookies</h2>
        <p>Where applicable, cookies and similar technologies may help us:</p>
        <ul>
          <li>Keep essential website features working.</li>
          <li>Protect the website against misuse and security threats.</li>
          <li>Remember preferences and cookie consent choices.</li>
          <li>Measure website performance where enabled and permitted.</li>
          <li>Support permitted marketing activities if introduced.</li>
        </ul>

        <h2>5. Your consent and cookie choices</h2>
        <p>
          We will seek consent before using cookies or similar
          technologies that require it under applicable UK law.
          Strictly necessary technologies may be used without consent
          where the relevant legal exemption applies.
        </p>
        <p>
          Where a cookie preference tool is available, you can use it
          to accept or reject optional categories and change your
          choices later. Rejecting optional cookies should not prevent
          you from using features that do not depend on them.
        </p>
        <p>
          Simply continuing to browse the website does not, by itself,
          constitute consent to technologies that require consent.
        </p>

        <h2>6. Third-party cookies</h2>
        <p>
          Some website features or service providers may use their
          own technologies. If enabled, these may allow third parties
          to receive information in accordance with their role and
          applicable privacy terms. Relevant third parties and their
          purposes should be identified where required.
        </p>

        <h2>7. How long cookies remain on your device</h2>
        <p>
          Session cookies generally expire when you close your browser.
          Persistent cookies remain for a specified period or until
          deleted. Their duration depends on the individual technology
          and its purpose. Our actual cookie list should document the
          technologies used and their expiry periods.
        </p>

        <h2>8. Managing cookies through your browser</h2>
        <p>
          Most browsers allow you to view, delete or block cookies
          through their settings. Blocking all cookies may affect
          some website functionality. Browser controls do not replace
          any consent choices you need to make through our website.
        </p>

        <h2>9. Personal data and privacy</h2>
        <p>
          Information collected through cookies may constitute
          personal data. Where applicable, our handling of that
          information is explained in our{" "}
          <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>

        <h2>10. Changes to this policy</h2>
        <p>
          We may update this policy when our website, technologies
          or legal obligations change. The latest version will be
          published on this page with an updated review date.
        </p>

        <h2>11. Contact us</h2>
        <p>
          If you have questions about our use of cookies or similar
          technologies, email{" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>.
        </p>

        <h2>Related policies</h2>
        <p>
          Find more information about using Static Holidays:
        </p>
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/booking-terms">Booking Terms</Link></li>
          <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
          <li><Link to="/travel-insurance">Travel Insurance</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </main>

      <footer className="cp-footer">
        <p><strong>Static Holidays</strong></p>
        <p>Find your next place to stay.</p>
        <p>
          <Link to="/properties">Explore stays</Link>
          <Link to="/booking-terms">Booking Terms</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/contact">Contact</Link>
        </p>
        <p>© {new Date().getFullYear()} Static Holidays</p>
      </footer>
    </div>
  );
}
