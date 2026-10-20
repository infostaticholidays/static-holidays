
import { Link } from "react-router-dom";

const termsSections = [
  {
    title: "1. About Static Holidays",
    paragraphs: [
      "Static Holidays operates an online platform that helps guests discover holiday accommodation offered by independent property owners.",
      "Unless stated otherwise during the booking process, Static Holidays acts as an intermediary between guests and property owners. We do not own or personally operate the advertised accommodation. The property owner is responsible for providing the stay and the property's facilities, condition and house rules.",
      "Your booking confirmation will explain the contractual arrangements that apply to your reservation."
    ]
  },
  {
    title: "2. Making a booking",
    paragraphs: [
      "You must provide accurate contact details, guest numbers and booking information. Before paying, check the property description, dates, total price, house rules and cancellation policy.",
      "A booking is confirmed in accordance with the confirmation process displayed during checkout. Any property-specific conditions disclosed before booking also apply.",
      "You must be legally entitled to make the booking and must ensure that everyone in your party complies with the applicable terms."
    ]
  },
  {
    title: "3. Prices and payments",
    paragraphs: [
      "The applicable accommodation price, deposit, payment deadlines and any mandatory additional charges will be displayed during the booking process.",
      "You are responsible for paying the amounts due by the stated deadlines using the available payment methods. If a balance is overdue, the booking may be cancelled in accordance with the terms disclosed for that reservation.",
      "If you anticipate difficulty making a payment, contact Static Holidays as soon as possible. Contacting us does not automatically extend a payment deadline."
    ]
  },
  {
    title: "4. Guest cancellations and deposits",
    paragraphs: [
      "If you cancel a booking, the cancellation policy shown before you confirmed your reservation will apply.",
      "Where a non-refundable booking deposit was clearly disclosed, cancelling may mean you lose that deposit. Additional cancellation charges, if applicable, must be consistent with the terms provided at booking and applicable law.",
      "If you do not pay the required balance by the deadline, your reservation may be cancelled and your deposit may be retained where permitted by the applicable cancellation terms and law.",
      "Please contact us promptly if you need to cancel. Nothing in these terms removes any statutory right to a refund or other remedy."
    ]
  },
  {
    title: "5. Cancellation by the property owner",
    paragraphs: [
      "If the owner cancels a confirmed booking and cannot provide the accommodation, Static Holidays will assist with communicating the cancellation and arranging the applicable refund.",
      "Where the owner cancels and the accommodation cannot be provided, guests will receive a refund of payments made for the cancelled accommodation in accordance with the applicable booking arrangements and law.",
      "Alternative accommodation may be offered where available, but it will only be arranged with your agreement. Refund processing times can depend on the payment method and payment provider."
    ]
  },
  {
    title: "6. Property descriptions and facilities",
    paragraphs: [
      "Listings may include photographs, descriptions, facilities, location information, occupancy limits and other details supplied by the property owner.",
      "Property owners are responsible for the accuracy of the information they provide and for delivering the accommodation as agreed. Please review the listing carefully and ask questions before booking if anything is unclear.",
      "If an important facility is unavailable or the property differs materially from what was agreed, contact the owner promptly and contact Static Holidays if you need assistance."
    ]
  },
  {
    title: "7. House rules and guest responsibilities",
    paragraphs: [
      "Each property may have its own rules concerning occupancy, visitors, pets, smoking, parties, noise, parking, rubbish, use of facilities and other matters. You must review and follow the rules supplied for your accommodation.",
      "You are responsible for ensuring that everyone in your party behaves respectfully and complies with the applicable rules. You must take reasonable care of the property and its contents and report any damage or safety concerns promptly.",
      "If you seriously breach the house rules, the owner may take appropriate action, including requiring you to leave where permitted by the booking terms and applicable law.",
      "If your stay is ended because of your breach, a refund may not be available. This depends on the circumstances, the applicable terms and your legal rights; no blanket exclusion of statutory rights applies."
    ]
  },
  {
    title: "8. Check-in and check-out",
    paragraphs: [
      "Arrival and departure times, access instructions and key collection details will be provided in your booking information or by the property owner.",
      "You must follow these arrangements and contact the owner promptly if you expect to arrive late or have difficulty accessing the property.",
      "Additional charges for unauthorised late departure may apply only where properly disclosed and permitted by the applicable terms and law."
    ]
  },
  {
    title: "9. Deposits and property damage",
    paragraphs: [
      "A booking deposit paid to secure a reservation is not necessarily the same as a security deposit held against possible damage.",
      "Any security deposit, its purpose, the circumstances in which deductions may be made and the expected return arrangements should be explained before you book.",
      "Guests may be responsible for reasonable, evidenced costs arising from damage they cause, subject to the applicable booking terms and law."
    ]
  },
  {
    title: "10. Problems, complaints and assistance",
    paragraphs: [
      "If something goes wrong during your stay, report the issue to the property owner or their designated contact as soon as possible so they have an opportunity to address it.",
      "You may also contact Static Holidays for help communicating with the owner. We will make reasonable efforts to assist, but our role as a platform does not replace the owner's responsibilities or remove any rights you may have.",
      "For urgent threats to health or safety, contact the appropriate emergency services."
    ]
  },
  {
    title: "11. The role and responsibilities of Static Holidays",
    paragraphs: [
      "Static Holidays provides an online platform for discovering properties and facilitating bookings. The owner is responsible for providing the accommodation unless your booking expressly states a different arrangement.",
      "We aim to present booking information clearly and assist with booking-related communication. We cannot guarantee that circumstances outside our reasonable control will never affect a stay.",
      "Nothing in these terms excludes or limits liability or obligations that cannot lawfully be excluded or limited."
    ]
  },
  {
    title: "12. Privacy and personal information",
    paragraphs: [
      "Personal information is handled in accordance with our Privacy Policy. Information may be shared with the relevant property owner and service providers where necessary to administer a booking and where permitted by applicable data protection law.",
      "Please read the Privacy Policy for more information about how personal information is used and your rights."
    ]
  },
  {
    title: "13. Changes to these terms",
    paragraphs: [
      "We may update these terms when our services or legal obligations change. The applicable terms for an existing booking will be determined in accordance with the booking agreement and applicable law.",
      "Changes to these website terms will not remove rights that have already accrued or override the terms agreed for an existing booking where doing so would be unlawful."
    ]
  },
  {
    title: "14. Applicable law",
    paragraphs: [
      "These terms are subject to applicable consumer protection law. Where legally appropriate, the laws of England and Wales will apply.",
      "Nothing in these terms prevents you from exercising any mandatory consumer rights or pursuing a legal remedy available to you."
    ]
  }
];

export default function BookingTerms() {
  return (
    <main className="sh-terms">
      <style>{`
        .sh-terms {
          --sh-green: #286442;
          --sh-dark-green: #1d472f;
          --sh-pale-green: #edf4ed;
          --sh-text: #20372a;
          --sh-muted: #718076;
          --sh-border: #e6ece6;
          min-height: 100vh;
          background: #fff;
          color: var(--sh-text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .sh-terms * { box-sizing: border-box; }
        .sh-terms a { text-decoration: none; }
        .sh-terms-nav {
          width: 100%;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 15px clamp(20px, 5vw, 76px);
          background: #fff;
          border-bottom: 1px solid #edf0ed;
        }
        .sh-terms-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--sh-text);
        }
        .sh-terms-brand-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--sh-green);
          color: white;
          font-size: 26px;
        }
        .sh-terms-brand-name {
          display: block;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 750;
          letter-spacing: -.6px;
        }
        .sh-terms-brand-caption {
          display: block;
          margin-top: 4px;
          color: var(--sh-muted);
          font-size: 11px;
        }
        .sh-terms-nav-links {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2.4vw, 34px);
        }
        .sh-terms-nav-links a {
          color: #425449;
          font-size: 13px;
          font-weight: 600;
        }
        .sh-terms-nav-links a:hover { color: var(--sh-green); }
        .sh-terms-signin {
          padding: 11px 18px;
          border: 1px solid #dce6dd;
          border-radius: 10px;
        }
        .sh-terms-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: flex;
          align-items: center;
          min-height: 330px;
          padding: 65px clamp(20px, 6vw, 88px);
          border-radius: 0 0 26px 26px;
          background-color: #345a42;
          background-image: url("https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=2200&q=85");
          background-size: cover;
          background-position: center 55%;
        }
        .sh-terms-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(90deg,
            rgba(16,39,27,.88), rgba(20,48,32,.65) 60%,
            rgba(20,48,32,.25));
        }
        .sh-terms-hero-inner {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }
        .sh-terms-eyebrow {
          display: inline-block;
          margin-bottom: 16px;
          color: #e2eee2;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 2.4px;
        }
        .sh-terms-hero h1 {
          max-width: 800px;
          margin: 0;
          color: #fff;
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1.08;
          font-weight: 680;
          letter-spacing: -2.5px;
        }
        .sh-terms-hero p {
          max-width: 620px;
          margin: 20px 0 0;
          color: #f0f5ef;
          font-size: 16px;
          line-height: 1.8;
        }
        .sh-terms-summary {
          max-width: 1288px;
          margin: 0 auto;
          padding: 38px clamp(20px, 5vw, 76px) 0;
        }
        .sh-terms-summary-inner {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 26px;
          padding: clamp(24px, 4vw, 38px);
          border-radius: 20px;
          background: var(--sh-pale-green);
        }
        .sh-terms-kicker {
          margin: 0 0 10px;
          color: var(--sh-green);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }
        .sh-terms-summary h2 {
          margin: 0;
          color: var(--sh-dark-green);
          font-size: clamp(24px, 3vw, 32px);
          line-height: 1.2;
          letter-spacing: -1px;
        }
        .sh-terms-summary p {
          margin: 12px 0 0;
          color: #5f7465;
          font-size: 13px;
          line-height: 1.8;
        }
        .sh-terms-highlights {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .sh-terms-highlight {
          padding: 17px;
          border: 1px solid #e2ebe2;
          border-radius: 13px;
          background: #fff;
        }
        .sh-terms-highlight-icon {
          display: block;
          margin-bottom: 10px;
          color: var(--sh-green);
          font-size: 22px;
        }
        .sh-terms-highlight strong {
          display: block;
          color: var(--sh-dark-green);
          font-size: 13px;
        }
        .sh-terms-highlight span:last-child {
          display: block;
          margin-top: 6px;
          color: var(--sh-muted);
          font-size: 11px;
          line-height: 1.6;
        }
        .sh-terms-content {
          max-width: 1060px;
          margin: 0 auto;
          padding: 52px 24px 72px;
        }
        .sh-terms-content-heading {
          margin-bottom: 12px;
          color: var(--sh-dark-green);
          font-size: clamp(26px, 3vw, 34px);
          letter-spacing: -1px;
        }
        .sh-terms-updated {
          margin: 0 0 24px;
          color: var(--sh-muted);
          font-size: 12px;
        }
        .sh-terms-section {
          padding: 25px 0;
          border-bottom: 1px solid var(--sh-border);
        }
        .sh-terms-section h3 {
          margin: 0 0 12px;
          color: var(--sh-dark-green);
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -.3px;
        }
        .sh-terms-section p {
          margin: 0 0 12px;
          color: #526056;
          font-size: 14px;
          line-height: 1.85;
        }
        .sh-terms-section p:last-child { margin-bottom: 0; }
        .sh-terms-contact {
          margin-top: 30px;
          padding: 27px;
          border-radius: 16px;
          background: var(--sh-pale-green);
        }
        .sh-terms-contact h3 {
          margin: 0 0 10px;
          color: var(--sh-dark-green);
          font-size: 21px;
        }
        .sh-terms-contact p {
          margin: 0 0 15px;
          color: #526056;
          font-size: 13px;
          line-height: 1.8;
        }
        .sh-terms-contact a {
          color: var(--sh-green);
          font-weight: 750;
        }
        .sh-terms-footer {
          margin-top: 0;
          padding: 42px clamp(22px, 5vw, 76px) 20px;
          border-top: 5px solid #286442;
          background: #1d472f;
          color: #fff;
        }
        .sh-terms-footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.35fr 1fr 1.3fr;
          gap: 30px;
          align-items: start;
          max-width: 1288px;
          margin: 0 auto;
        }
        .sh-terms-footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        .sh-terms-footer-logo {
          color: #fff;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.25;
        }
        .sh-terms-footer p {
          margin: 0;
          color: #d4e2d3;
          font-size: 13px;
          line-height: 1.8;
        }
        .sh-terms-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        .sh-terms-footer-column h3 {
          margin: 0 0 5px;
          color: #d6e7d3;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.5;
          letter-spacing: .7px;
          text-transform: uppercase;
        }
        .sh-terms-footer-column a,
        .sh-terms-footer-bottom a {
          color: #fff;
          font-size: 13px;
          line-height: 1.6;
        }
        .sh-terms-footer-column a:hover,
        .sh-terms-footer-bottom a:hover { opacity: .8; }
        .sh-terms-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          max-width: 1288px;
          margin: 34px auto 0;
          padding-top: 18px;
          border-top: 1px solid #42634d;
        }
        .sh-terms-footer-bottom p { font-size: 11px; }
        .sh-terms-footer-bottom a { font-size: 12px; font-weight: 600; }
        @media (max-width: 1000px) {
          .sh-terms-footer-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 30px 24px;
          }
        }
        @media (max-width: 650px) {
          .sh-terms-nav { min-height: 72px; gap: 10px; padding: 12px 16px; }
          .sh-terms-brand-icon { width: 38px; height: 38px; }
          .sh-terms-brand-name { font-size: 17px; }
          .sh-terms-brand-caption { font-size: 10px; }
          .sh-terms-nav-links { gap: 12px; }
          .sh-terms-nav-links a { font-size: 11px; }
          .sh-terms-signin { padding: 9px 10px; }
          .sh-terms-hero { min-height: 290px; padding: 52px 20px; }
          .sh-terms-hero h1 { font-size: 40px; letter-spacing: -1.8px; }
          .sh-terms-hero p { font-size: 14px; }
          .sh-terms-summary { padding-top: 25px; }
          .sh-terms-summary-inner { grid-template-columns: 1fr; gap: 22px; }
          .sh-terms-content { padding: 40px 20px 52px; }
          .sh-terms-section { padding: 22px 0; }
          .sh-terms-section h3 { font-size: 18px; }
          .sh-terms-section p { font-size: 13px; }
          .sh-terms-footer { padding: 32px 22px 18px; }
          .sh-terms-footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 28px 18px;
          }
          .sh-terms-footer-brand { grid-column: 1 / -1; }
          .sh-terms-footer-bottom {
            margin-top: 28px;
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }
        }
        @media (max-width: 360px) {
          .sh-terms-footer-grid { grid-template-columns: 1fr; }
          .sh-terms-footer-brand { grid-column: auto; }
          .sh-terms-highlights { grid-template-columns: 1fr; }
          .sh-terms-nav-links .sh-terms-hide-mobile { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sh-terms *, .sh-terms *::before, .sh-terms *::after {
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="sh-terms-nav">
        <Link
          to="/"
          className="sh-terms-brand"
          aria-label="Static Holidays homepage"
        >
          <span className="sh-terms-brand-icon">⌂</span>
          <span>
            <span className="sh-terms-brand-name">Static Holidays</span>
            <span className="sh-terms-brand-caption">
              Your next escape awaits
            </span>
          </span>
        </Link>

        <nav className="sh-terms-nav-links" aria-label="Main navigation">
          <Link className="sh-terms-hide-mobile" to="/properties">
            Explore stays
          </Link>
          <Link className="sh-terms-hide-mobile" to="/dashboard">
            Dashboard
          </Link>
          <Link className="sh-terms-signin" to="/login">
            Sign in
          </Link>
        </nav>
      </header>

      <section className="sh-terms-hero">
        <div className="sh-terms-hero-inner">
          <span className="sh-terms-eyebrow">
            GUEST INFORMATION
          </span>
          <h1>Booking Terms &amp; Conditions</h1>
          <p>
            Everything you need to know before booking your stay.
            Please read these terms alongside your chosen property's
            description, house rules and cancellation policy.
          </p>
        </div>
      </section>

      <section className="sh-terms-summary">
        <div className="sh-terms-summary-inner">
          <div>
            <p className="sh-terms-kicker">YOUR BOOKING, CLEARLY EXPLAINED</p>
            <h2>Know what to expect before you arrive.</h2>
            <p>
              Static Holidays helps guests find accommodation offered by
              independent property owners. These terms explain the booking
              process, payments, cancellations and responsibilities.
            </p>
          </div>

          <div className="sh-terms-highlights">
            <div className="sh-terms-highlight">
              <span className="sh-terms-highlight-icon">£</span>
              <strong>Payments &amp; deposits</strong>
              <span>Understand payment deadlines and cancellation conditions.</span>
            </div>
            <div className="sh-terms-highlight">
              <span className="sh-terms-highlight-icon">⌂</span>
              <strong>Property rules</strong>
              <span>Each stay may have its own owner-specific rules.</span>
            </div>
            <div className="sh-terms-highlight">
              <span className="sh-terms-highlight-icon">✓</span>
              <strong>Owner cancellations</strong>
              <span>Understand what happens if a stay cannot go ahead.</span>
            </div>
            <div className="sh-terms-highlight">
              <span className="sh-terms-highlight-icon">✉</span>
              <strong>Help when needed</strong>
              <span>Know how to contact us about a booking.</span>
            </div>
          </div>
        </div>
      </section>

      <article className="sh-terms-content">
        <h2 className="sh-terms-content-heading">
          Booking Terms &amp; Conditions
        </h2>
        <p className="sh-terms-updated">
          Last updated: 20 October 2026
        </p>

        {termsSections.map((section) => (
          <section className="sh-terms-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section className="sh-terms-contact">
          <h3>Need help with your booking?</h3>
          <p>
            If you have a question about these terms or a reservation,
            contact Static Holidays. Please include your booking reference
            where relevant.
          </p>
          <Link to="/contact">Contact Static Holidays →</Link>
          <p style={{ marginTop: 12 }}>
            Email: infostaticholidays@gmail.com
          </p>
        </section>

        <p className="sh-terms-updated" style={{ marginTop: 24, lineHeight: 1.8 }}>
          These terms are a working draft and should be checked against
          your actual booking, payment and refund arrangements and applicable
          UK law before publication.
        </p>
      </article>

      <footer className="sh-terms-footer">
        <div className="sh-terms-footer-grid">
          <div className="sh-terms-footer-brand">
            <Link to="/" className="sh-terms-footer-logo">
              Static Holidays
            </Link>
            <p>Lovely places to stay. Memorable moments to make.</p>
          </div>

          <div className="sh-terms-footer-column">
            <h3>Explore</h3>
            <Link to="/properties">Explore stays</Link>
            <Link to="/dashboard">List your property</Link>
            <Link to="/contact">Contact us</Link>
          </div>

          <div className="sh-terms-footer-column">
            <h3>Guest information</h3>
            <Link to="/booking-terms">Booking Terms &amp; Conditions</Link>
            <Link to="/cancellation-policy">Cancellation Policy</Link>
            <Link to="/travel-insurance">Travel Insurance Information</Link>
          </div>

          <div className="sh-terms-footer-column">
            <h3>Privacy &amp; legal</h3>
            <Link to="/privacy-policy">GDPR &amp; Privacy Policy</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>

          <div className="sh-terms-footer-column">
            <h3>Property owners</h3>
            <Link to="/owner-terms">Owner Terms &amp; Conditions</Link>
          </div>
        </div>

        <div className="sh-terms-footer-bottom">
          <p>
            © {new Date().getFullYear()} Static Holidays. All rights reserved.
          </p>
          <Link to="/properties">Explore all stays →</Link>
        </div>
      </footer>
    </main>
  );
}
