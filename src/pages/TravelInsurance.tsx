
import { Link } from "react-router-dom";

export default function TravelInsurance() {
  return (
    <div className="ti-page">
      <style>{`
        .ti-page {
          --green: #286442;
          --dark-green: #1d472f;
          --pale-green: #edf4ed;
          color: #26352b;
          font-family: Inter, system-ui, sans-serif;
          line-height: 1.7;
          background: #fff;
          min-height: 100vh;
        }
        .ti-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px 6%;
          border-bottom: 1px solid #e4ebe5;
        }
        .ti-brand {
          color: var(--dark-green);
          text-decoration: none;
          font-size: 1.35rem;
          font-weight: 800;
        }
        .ti-nav a:not(.ti-brand) {
          color: var(--dark-green);
          text-decoration: none;
          font-weight: 600;
        }
        .ti-hero {
          background: var(--pale-green);
          text-align: center;
          padding: 58px 20px;
        }
        .ti-hero h1 {
          color: var(--dark-green);
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.2;
          margin: 0 0 14px;
        }
        .ti-hero p {
          max-width: 700px;
          margin: 0 auto;
        }
        .ti-content {
          max-width: 850px;
          margin: 0 auto;
          padding: 42px 22px 65px;
        }
        .ti-content h2 {
          color: var(--dark-green);
          font-size: 1.35rem;
          margin-top: 34px;
          margin-bottom: 10px;
        }
        .ti-content a {
          color: var(--green);
          font-weight: 600;
        }
        .ti-note {
          background: var(--pale-green);
          border-left: 4px solid var(--green);
          border-radius: 6px;
          padding: 16px 20px;
          margin: 24px 0;
        }
        .ti-footer {
          background: var(--dark-green);
          color: #fff;
          padding: 30px 6%;
          text-align: center;
        }
        .ti-footer p { margin: 6px 0; }
        .ti-footer a {
          color: #fff;
          text-decoration: none;
          margin: 0 8px;
        }
        @media (max-width: 600px) {
          .ti-nav { padding: 16px 5%; flex-wrap: wrap; }
          .ti-content { padding: 30px 20px 45px; }
          .ti-footer a {
            display: inline-block;
            margin: 5px 8px;
          }
        }
      `}</style>

      <header className="ti-nav">
        <Link to="/" className="ti-brand">
          Static Holidays
        </Link>
        <nav>
          <Link to="/properties">Explore stays</Link>
        </nav>
      </header>

      <section className="ti-hero">
        <h1>Travel &amp; Holiday Insurance</h1>
        <p>
          Important information about protecting your trip
          and your holiday property.
        </p>
      </section>

      <main className="ti-content">
        <p>
          At Static Holidays, we want guests and property owners
          to make informed decisions about protecting themselves
          against unexpected events. We strongly recommend
          considering appropriate insurance before travelling
          or making a holiday property available for bookings.
        </p>

        <div className="ti-note">
          <strong>Please note:</strong> Static Holidays is a
          third-party booking platform. We do not provide,
          sell, arrange, administer or underwrite travel
          insurance, holiday insurance or holiday-let
          property insurance. We are not an insurer or
          insurance broker.
        </div>

        <h2>1. Travel insurance for guests</h2>
        <p>
          Guests are encouraged to consider suitable travel
          insurance when booking a holiday. Depending on the
          policy selected, cover may be available for events
          such as cancellation, travel disruption, emergency
          medical expenses, lost belongings or curtailment
          of a trip.
        </p>
        <p>
          Insurance policies differ significantly. Cover is
          not guaranteed, and exclusions, excesses, conditions
          and limits may apply. Guests should check that any
          policy meets their individual needs and covers the
          activities and destinations relevant to their trip.
        </p>
        <p>
          Guests should pay particular attention to whether
          their policy covers cancellation of privately booked
          holiday accommodation and circumstances that could
          prevent them from travelling.
        </p>

        <h2>2. Holiday-let insurance for property owners</h2>
        <p>
          Property owners are responsible for assessing their
          own insurance requirements and arranging appropriate
          cover for their property and letting activities.
        </p>
        <p>
          Ordinary residential home insurance may not cover
          short-term holiday letting. Owners should speak
          directly with an appropriately qualified insurer
          or insurance adviser about cover suitable for
          their circumstances.
        </p>
        <p>
          Depending on the property and policy, owners may
          wish to consider buildings and contents cover,
          public liability, accidental or malicious damage,
          loss of rental income and other risks associated
          with paying guests.
        </p>
        <p>
          Owners are responsible for checking any applicable
          policy conditions, exclusions and requirements,
          including requirements relating to guest occupancy
          and short-term letting.
        </p>

        <h2>3. Static Holidays does not provide insurance</h2>
        <p>
          Static Holidays does not act as an insurer,
          insurance intermediary or insurance adviser through
          its platform. We do not assess insurance needs,
          recommend individual insurance products, arrange
          policies or determine whether a claim is covered.
        </p>
        <p>
          Any recommendation on this page to consider
          insurance is general information only and is not
          personalised insurance advice or a guarantee that
          a particular policy will be suitable.
        </p>
        <p>
          Static Holidays does not guarantee that any loss,
          cancellation, damage, injury, expense or other
          event will be covered by insurance. Any claim must
          be made directly to the relevant insurer and will
          be assessed under the applicable policy.
        </p>

        <h2>4. Cancellations and refunds</h2>
        <p>
          Travel insurance may provide cover for certain
          cancellation events, but this depends on the
          policy wording and the circumstances. Purchasing
          insurance does not guarantee that a claim will
          be accepted.
        </p>
        <p>
          Static Holidays does not itself issue or process
          refunds. Cancellation requests and any refund
          entitlement are governed by the applicable booking
          terms, the relevant parties' responsibilities and
          applicable law.
        </p>
        <p>
          Guests should read our{" "}
          <Link to="/cancellation-policy">
            Cancellation Policy
          </Link>{" "}
          and{" "}
          <Link to="/booking-terms">
            Booking Terms &amp; Conditions
          </Link>{" "}
          before confirming a booking. Insurance should not
          be treated as a substitute for understanding those
          terms.
        </p>

        <h2>5. Choosing an insurance provider</h2>
        <p>
          Guests and owners should make their own enquiries
          and compare suitable policies. Check the insurer's
          identity, the scope of cover, exclusions, excesses,
          claim requirements and cancellation provisions
          before purchasing a policy.
        </p>
        <p>
          Where relevant, check the provider's regulatory
          status through the official UK Financial Conduct
          Authority register and seek independent advice
          if you are unsure about the cover you need.
        </p>
        <p>
          Static Holidays does not endorse or guarantee any
          insurer or insurance product through this page.
          Unless explicitly stated otherwise, we receive no
          commission for any insurance purchase arising
          from this general recommendation.
        </p>

        <h2>6. Limitation and legal rights</h2>
        <p>
          Nothing on this page creates an insurance contract
          between you and Static Holidays, or makes Static
          Holidays responsible for arranging cover or paying
          an insurance claim.
        </p>
        <p>
          Nothing in this policy excludes or limits any
          liability or legal right that cannot lawfully be
          excluded or limited. Your rights and obligations
          remain subject to applicable law and any relevant
          contract.
        </p>

        <h2>7. Contact us</h2>
        <p>
          For questions about using the Static Holidays
          platform, you can contact us at{" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>.
        </p>
        <p>
          We cannot advise you on which insurance policy
          to buy, confirm whether a claim will be accepted
          or arrange insurance cover for you.
        </p>
      </main>

      <footer className="ti-footer">
        <p><strong>Static Holidays</strong></p>
        <p>Find your next place to stay.</p>
        <p>
          <Link to="/properties">Explore stays</Link>
          <Link to="/booking-terms">Booking Terms</Link>
          <Link to="/cancellation-policy">Cancellation Policy</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/contact">Contact</Link>
        </p>
        <p>© {new Date().getFullYear()} Static Holidays</p>
      </footer>
    </div>
  );
}
