
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="pp-page">
      <style>{`
        .pp-page {
          --green: #286442;
          --dark-green: #1d472f;
          --pale-green: #edf4ed;
          color: #26352b;
          font-family: Inter, system-ui, sans-serif;
          line-height: 1.7;
          background: #fff;
          min-height: 100vh;
        }
        .pp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px 6%;
          border-bottom: 1px solid #e4ebe5;
        }
        .pp-brand {
          color: var(--dark-green);
          text-decoration: none;
          font-size: 1.35rem;
          font-weight: 800;
        }
        .pp-nav a:not(.pp-brand) {
          color: var(--dark-green);
          text-decoration: none;
          font-weight: 600;
        }
        .pp-hero {
          background: var(--pale-green);
          text-align: center;
          padding: 58px 20px;
        }
        .pp-hero h1 {
          color: var(--dark-green);
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.2;
          margin: 0 0 14px;
        }
        .pp-hero p {
          max-width: 700px;
          margin: 0 auto;
        }
        .pp-content {
          max-width: 850px;
          margin: 0 auto;
          padding: 42px 22px 65px;
        }
        .pp-content h2 {
          color: var(--dark-green);
          font-size: 1.35rem;
          margin-top: 34px;
          margin-bottom: 10px;
        }
        .pp-content a {
          color: var(--green);
          font-weight: 600;
        }
        .pp-note {
          background: var(--pale-green);
          border-left: 4px solid var(--green);
          border-radius: 6px;
          padding: 16px 20px;
          margin: 24px 0;
        }
        .pp-footer {
          background: var(--dark-green);
          color: #fff;
          padding: 30px 6%;
          text-align: center;
        }
        .pp-footer p { margin: 6px 0; }
        .pp-footer a {
          color: #fff;
          text-decoration: none;
          margin: 0 8px;
        }
        @media (max-width: 600px) {
          .pp-nav { padding: 16px 5%; flex-wrap: wrap; }
          .pp-content { padding: 30px 20px 45px; }
          .pp-footer a {
            display: inline-block;
            margin: 5px 8px;
          }
        }
      `}</style>

      <header className="pp-nav">
        <Link to="/" className="pp-brand">Static Holidays</Link>
        <nav><Link to="/properties">Explore stays</Link></nav>
      </header>

      <section className="pp-hero">
        <h1>GDPR &amp; Privacy Policy</h1>
        <p>
          How Static Holidays collects, uses, stores and
          protects personal information.
        </p>
      </section>

      <main className="pp-content">
        <p>
          <strong>Last updated:</strong> 20 October 2026
        </p>

        <p>
          Static Holidays respects your privacy and aims to
          handle personal information responsibly. This policy
          explains how information may be collected and used
          when you visit our website, create an account,
          contact us or use our platform.
        </p>

        <div className="pp-note">
          <strong>Our role:</strong> Static Holidays is a
          third-party platform connecting guests with
          independent holiday property owners. We do not
          own the accommodation listed on our website.
        </div>

        <h2>1. Who we are</h2>
        <p>
          In this policy, “Static Holidays”, “we”, “us” and
          “our” refer to the operator of the Static Holidays
          website and platform.
        </p>
        <p>
          For privacy enquiries, contact us at:
        </p>
        <p>
          Email:{" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>
        </p>
        <p>
          Before publishing, the website operator should ensure
          that its full legal name and appropriate business
          contact details are included here.
        </p>

        <h2>2. Personal information we may collect</h2>
        <p>
          Depending on how you use the platform, information
          may include:
        </p>
        <ul>
          <li>Name and contact details, such as email address.</li>
          <li>Account details and authentication information.</li>
          <li>Booking enquiries, messages and correspondence.</li>
          <li>Property listing details supplied by owners.</li>
          <li>Booking-related information needed to connect guests and owners.</li>
          <li>
            Technical information such as IP address, browser
            type, device information and website activity,
            where collected by our systems.
          </li>
          <li>
            Cookie preferences and similar information,
            where applicable.
          </li>
        </ul>
        <p>
          We aim to collect only information that is
          reasonably necessary for the relevant purpose.
          Please do not send sensitive personal information
          unless it is genuinely necessary.
        </p>

        <h2>3. How we use personal information</h2>
        <p>Depending on the features you use, we may process information to:</p>
        <ul>
          <li>Create and manage user accounts.</li>
          <li>Operate and maintain the website and platform.</li>
          <li>Respond to enquiries and provide customer support.</li>
          <li>Connect guests with relevant property owners.</li>
          <li>Manage listing information and booking-related communications.</li>
          <li>Protect the platform, investigate misuse and help prevent fraud.</li>
          <li>Meet legal obligations and handle legitimate disputes.</li>
          <li>Send optional marketing communications where legally permitted.</li>
        </ul>
        <p>
          We do not use personal information for purposes
          incompatible with the reason it was collected
          without an appropriate legal basis.
        </p>

        <h2>4. Our legal bases for processing</h2>
        <p>
          Data protection law requires us to have a lawful
          basis for using personal information. Depending on
          the circumstances, this may include:
        </p>
        <ul>
          <li>
            <strong>Contract:</strong> where processing is
            necessary to provide a service you request or
            take steps at your request.
          </li>
          <li>
            <strong>Legitimate interests:</strong> where
            necessary for purposes such as operating,
            securing and improving the platform, provided
            those interests do not override your rights.
          </li>
          <li>
            <strong>Legal obligation:</strong> where we
            need to comply with applicable law.
          </li>
          <li>
            <strong>Consent:</strong> where we rely on your
            permission, for example for certain optional
            cookies or marketing activities.
          </li>
        </ul>
        <p>
          The applicable basis depends on the specific
          processing activity. We will seek consent where
          it is required and explain how to withdraw it.
        </p>

        <h2>5. Sharing information with property owners</h2>
        <p>
          Because Static Holidays connects guests with
          independent property owners, relevant information
          may be shared with an owner when necessary to
          respond to an enquiry or support a booking-related
          request.
        </p>
        <p>
          Please be aware that property owners may process
          information they receive under their own privacy
          responsibilities. You should contact the relevant
          owner for information about their separate
          processing where appropriate.
        </p>

        <h2>6. Service providers and other recipients</h2>
        <p>
          We may share information with service providers
          where necessary to operate the platform. Depending
          on the services actually used, these may include:
        </p>
        <ul>
          <li>
            Website hosting and deployment providers, such
            as Vercel if used by the live service.
          </li>
          <li>
            Database, account and authentication providers,
            such as Supabase if used by the live service.
          </li>
          <li>
            Email, security, technical support and
            maintenance providers, where applicable.
          </li>
          <li>
            Professional advisers, regulators, law
            enforcement or other parties where disclosure
            is legally required or permitted.
          </li>
        </ul>
        <p>
          We do not sell personal information as a business
          model. We do not share information with third
          parties for their own marketing unless we have
          an appropriate legal basis.
        </p>
        <p>
          The providers listed above are examples based on
          possible website infrastructure. The published
          policy must be checked against the services
          actually connected to Static Holidays.
        </p>

        <h2>7. International transfers</h2>
        <p>
          Some service providers may process information
          outside the United Kingdom. Where personal
          information is transferred internationally, we
          will take steps required by applicable data
          protection law to ensure an appropriate level
          of protection.
        </p>
        <p>
          The final policy should identify relevant
          transfers and safeguards based on the providers
          and locations actually used.
        </p>

        <h2>8. How long we keep information</h2>
        <p>
          We keep personal information only for as long
          as reasonably necessary for the purposes for
          which it was collected, including account
          management, support, security and legal
          obligations.
        </p>
        <p>
          Retention periods depend on the type of
          information and why it is needed. When
          information is no longer required, we will
          delete it or securely dispose of it, subject
          to any lawful need to retain it.
        </p>
        <p>
          Before publishing, we should set actual
          retention periods or clear criteria for
          accounts, enquiries, booking records, logs
          and backups.
        </p>

        <h2>9. Security</h2>
        <p>
          We take reasonable technical and organisational
          steps to protect personal information against
          unauthorised access, loss, misuse or disclosure.
          No internet transmission or storage system can
          be guaranteed to be completely secure.
        </p>
        <p>
          You should keep your login details confidential
          and contact us if you suspect unauthorised use
          of your account.
        </p>

        <h2>10. Cookies and similar technologies</h2>
        <p>
          The website may use essential technologies
          needed for functions such as account access,
          security and remembering necessary preferences.
          If analytics, advertising or other non-essential
          technologies are used, we will provide
          appropriate information and obtain consent
          where required by law.
        </p>
        <p>
          The precise cookies and technologies used
          must be verified against the live website.
          You can read our{" "}
          <Link to="/cookie-policy">Cookie Policy</Link>.
        </p>

        <h2>11. Marketing communications</h2>
        <p>
          If we send marketing communications, we will
          do so in accordance with applicable privacy
          and electronic marketing rules. Where consent
          is required, we will ask for it first.
        </p>
        <p>
          You can withdraw marketing consent or
          unsubscribe using the method provided in the
          communication. Essential service messages
          about accounts or requests may still be sent
          where necessary.
        </p>

        <h2>12. Your data protection rights</h2>
        <p>
          Depending on the circumstances and applicable
          law, you may have the right to:
        </p>
        <ul>
          <li>Request access to your personal information.</li>
          <li>Ask us to correct inaccurate or incomplete information.</li>
          <li>Request deletion of information in certain circumstances.</li>
          <li>Request restriction of processing in certain circumstances.</li>
          <li>Object to processing where the law provides that right.</li>
          <li>Request transfer of information where data portability applies.</li>
          <li>Withdraw consent where processing is based on consent.</li>
        </ul>
        <p>
          To exercise a right, email{" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>
          {" "}with the subject “Data Protection Request”.
          We may need to verify your identity before
          responding. We will respond within the time
          required by applicable law.
        </p>
        <p>
          These rights are not absolute in every
          situation and may be subject to legal
          conditions or exemptions.
        </p>

        <h2>13. Complaints</h2>
        <p>
          If you have concerns about how we handle your
          personal information, please contact us first
          so that we can try to resolve them.
        </p>
        <p>
          You also have the right to complain to the UK
          Information Commissioner's Office (ICO):
        </p>
        <p>
          <a
            href="https://ico.org.uk/make-a-complaint/"
            target="_blank"
            rel="noreferrer"
          >
            Make a complaint to the ICO
          </a>
        </p>

        <h2>14. Children's information</h2>
        <p>
          The platform is intended for people who can
          lawfully use its services. Children should
          not submit personal information where they
          are not permitted to do so. If you believe a
          child has provided information inappropriately,
          contact us so we can review the matter.
        </p>

        <h2>15. Automated decisions</h2>
        <p>
          We do not intend to make decisions based
          solely on automated processing that produce
          legal or similarly significant effects on
          individuals. If this changes, we will update
          this policy and provide any information
          required by law.
        </p>

        <h2>16. Changes to this policy</h2>
        <p>
          We may update this policy when our platform,
          data practices or legal obligations change.
          The latest version will be published on this
          page with its updated date. Where required,
          we will notify affected users of significant
          changes.
        </p>

        <h2>17. Contact Static Holidays</h2>
        <p>
          For privacy questions, requests or concerns,
          contact:
        </p>
        <p>
          <strong>Static Holidays</strong><br />
          Email:{" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>
        </p>
      </main>

      <footer className="pp-footer">
        <p><strong>Static Holidays</strong></p>
        <p>Find your next place to stay.</p>
        <p>
          <Link to="/properties">Explore stays</Link>
          <Link to="/booking-terms">Booking Terms</Link>
          <Link to="/cancellation-policy">Cancellation Policy</Link>
          <Link to="/travel-insurance">Travel Insurance</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/contact">Contact</Link>
        </p>
        <p>© {new Date().getFullYear()} Static Holidays</p>
      </footer>
    </div>
  );
}
