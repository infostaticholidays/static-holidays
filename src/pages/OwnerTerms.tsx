
import { Link } from "react-router-dom";

export default function OwnerTerms() {
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
        .cp-footer a:hover { text-decoration: underline; }
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
        <Link to="/" className="cp-brand">Static Holidays</Link>
        <nav>
          <Link to="/properties">Explore stays</Link>
        </nav>
      </header>

      <section className="cp-hero">
        <h1>Owner Terms &amp; Conditions</h1>
        <p>
          The responsibilities, documentation and standards
          property owners must follow when listing accommodation
          through Static Holidays.
        </p>
        <p style={{ marginTop: 12, fontSize: "0.9rem", color: "#526b59" }}>
          Last updated: 20 October 2026
        </p>
      </section>

      <main className="cp-content">
        <p>
          These Owner Terms &amp; Conditions explain the requirements
          for property owners and authorised representatives who
          advertise holiday accommodation through Static Holidays.
          By submitting or maintaining a listing, you agree to comply
          with the applicable terms described below.
        </p>

        <div className="cp-note">
          <strong>Important — please read carefully.</strong>{" "}
          Static Holidays is a third-party accommodation platform.
          Unless a separate written agreement expressly states
          otherwise, we do not own, operate or manage the properties
          listed, and we do not ourselves issue or process refunds.
          Owners remain responsible for their properties, their
          legal obligations and the accommodation they provide.
        </div>

        <h2>1. Definitions and our role</h2>
        <p>
          In these terms, "Static Holidays", "we", "us" and "our"
          refer to the operator of the Static Holidays platform.
          "Owner" means a property owner or an authorised person
          or business listing accommodation. "Guest" means a person
          enquiring about or booking accommodation.
        </p>
        <p>
          Static Holidays provides a platform to help owners
          advertise accommodation and connect with prospective
          guests. The precise role of each party depends on the
          actual booking arrangements and any separate agreement.
        </p>
        <p>
          Unless expressly agreed in writing, Static Holidays is
          not the accommodation provider, landlord, property
          manager, insurer or guarantor of an owner's performance.
          Nothing in these terms removes any legal duty that
          applies to Static Holidays itself.
        </p>

        <h2>2. Owner eligibility and authority to let</h2>
        <p>
          You may list a property only if you are its owner or have
          valid authority to advertise and offer it for holiday
          accommodation.
        </p>
        <p>You must:</p>
        <ul>
          <li>Be legally entitled to offer the property for the advertised use.</li>
          <li>Obtain any necessary consent from a co-owner, landlord, freeholder, mortgage provider, management company or other relevant party.</li>
          <li>Comply with applicable tenancy, lease, title, planning and property-use restrictions.</li>
          <li>Ensure that any employee, agent or representative acting for you has appropriate authority.</li>
          <li>Tell us promptly if your authority to let the property ends or changes.</li>
        </ul>
        <p>
          Listing a property does not itself establish that you have
          the legal right to let it. You must resolve any restrictions
          before accepting bookings.
        </p>

        <h2>3. Identity and verification documents</h2>
        <p>
          We may request reasonable information or documents to
          verify your identity, authority to list a property, contact
          details or eligibility to use the platform. Verification
          requirements may vary depending on the property, location,
          applicable law and the services provided.
        </p>
        <p>Depending on the circumstances, requested documents may include:</p>
        <ul>
          <li>Proof of identity, such as an accepted identity document.</li>
          <li>Proof of address or verified contact details.</li>
          <li>Evidence of ownership or authority to let, where reasonably required.</li>
          <li>Business name, registered details or company information, if applicable.</li>
          <li>Property address and other information required to identify the listing.</li>
          <li>Applicable registration, licence, permit or registration number.</li>
          <li>Other documents reasonably needed to meet legal, safety, fraud-prevention or platform requirements.</li>
        </ul>
        <p>
          Only submit documents through the designated method we
          provide. Do not send passwords, full payment-card details
          or unnecessary sensitive information.
        </p>
        <p>
          We may request updated or additional evidence if documents
          expire, details change or verification is incomplete. Where
          required by law, we may need to collect or report certain
          owner or property information to the relevant authorities.
        </p>

        <h2>4. Licences, registration and legal permissions</h2>
        <p>
          Before listing and throughout the period a property is
          offered, you must identify and comply with the legal
          requirements that apply to its location and use.
        </p>
        <p>These may include, where applicable:</p>
        <ul>
          <li>Planning permission and lawful property use.</li>
          <li>Local authority registration, licensing or notification schemes.</li>
          <li>Short-term letting, holiday accommodation or tourism requirements.</li>
          <li>Leasehold, building-management, freeholder or mortgage restrictions.</li>
          <li>Tax registration, declarations and reporting obligations.</li>
          <li>Requirements applying to properties in designated or regulated areas.</li>
        </ul>
        <p>
          Requirements differ across the UK and internationally.
          You are responsible for checking the rules applying to
          your specific property and obtaining any necessary
          permissions before accepting guests.
        </p>
        <p>
          You must provide accurate licence or registration details
          when requested and notify us if a permission is suspended,
          expires, is withdrawn or becomes subject to a restriction.
        </p>

        <h2>5. Property safety and compliance documents</h2>
        <p>
          Owners must keep accommodation reasonably safe, maintained
          and suitable for the use advertised. You are responsible
          for identifying and complying with the safety duties that
          apply to your property and accommodation type.
        </p>
        <p>Depending on the property and applicable law, this may involve:</p>
        <ul>
          <li>Fire risk assessments and suitable fire precautions.</li>
          <li>Smoke alarms, carbon monoxide alarms and other required safety equipment.</li>
          <li>Gas safety checks and records where required.</li>
          <li>Electrical installation inspections and relevant safety documentation where required.</li>
          <li>Safe furniture, appliances, heating, water and other facilities.</li>
          <li>Swimming pool, hot tub, balcony, stairway or other property-specific safety measures.</li>
          <li>Legionella or water-system risk assessments where applicable.</li>
          <li>Suitable emergency information, evacuation arrangements and guest instructions.</li>
        </ul>
        <p>
          These examples are not a universal checklist or a statement
          that every document is legally required for every property.
          You must obtain qualified advice where needed and maintain
          the records that apply to your circumstances.
        </p>
        <p>
          Where we reasonably request evidence of compliance, you
          must provide accurate, current documents within the
          requested reasonable timeframe. You must not claim that a
          property is certified, inspected or compliant unless that
          claim is accurate and can be substantiated.
        </p>

        <h2>6. Insurance and financial responsibilities</h2>
        <p>
          You must assess your insurance needs and maintain any
          insurance required by law, a lease, a mortgage or another
          applicable agreement. You should confirm that your cover
          permits holiday letting and the actual activities taking
          place at the property.
        </p>
        <p>
          Depending on your circumstances, relevant cover may include
          property insurance, public liability insurance and other
          appropriate business or letting cover. These are examples,
          not a guarantee that any particular policy is sufficient.
        </p>
        <p>
          Unless separately agreed in writing, Static Holidays does
          not insure your property, guarantee your rental income or
          provide cover for damage, theft, injury, cancellations or
          guest disputes.
        </p>

        <h2>7. Accurate property listings</h2>
        <p>
          You are responsible for ensuring that all information you
          submit is accurate, current, lawful and not misleading.
          This includes:
        </p>
        <ul>
          <li>Property descriptions, location and accommodation type.</li>
          <li>Photographs, videos and other listing materials.</li>
          <li>Bedroom, bed, bathroom and maximum occupancy details.</li>
          <li>Facilities, accessibility information and any relevant limitations.</li>
          <li>Prices, additional charges, deposits and payment deadlines.</li>
          <li>Check-in and check-out arrangements.</li>
          <li>Availability, minimum stays and booking restrictions.</li>
          <li>Pet policies, smoking rules, noise restrictions and other house rules.</li>
          <li>Cancellation terms and any refund conditions applicable to a booking.</li>
        </ul>
        <p>
          You must own or have permission to use the photographs,
          text, logos and other materials you submit. Do not use
          another person's content in a way that infringes their
          copyright, trade marks, privacy or other rights.
        </p>
        <p>
          Update your listing promptly when material details change.
          If a significant problem makes the property unavailable,
          unsafe or materially different from its description, notify
          affected guests and Static Holidays as appropriate.
        </p>

        <h2>8. Pricing, fees and charges</h2>
        <p>
          You must ensure that advertised prices and any compulsory
          additional charges are clearly and accurately disclosed
          before a guest commits to a booking, in accordance with
          applicable law.
        </p>
        <p>
          This includes any cleaning charges, service charges, taxes,
          deposits or other amounts that apply. You must not introduce
          undisclosed compulsory charges after a booking is confirmed
          unless the change is permitted by the booking terms and law.
        </p>
        <p>
          Any platform fees or other amounts payable to Static Holidays
          must be explained in the relevant separate commercial terms
          or fee information. Nothing in this page creates a fee that
          has not otherwise been agreed or properly disclosed.
        </p>

        <h2>9. Bookings and availability</h2>
        <p>
          You must keep availability information accurate and ensure
          that you are able to honour bookings you confirm. Do not
          knowingly accept overlapping bookings for the same
          accommodation where you cannot provide the agreed stay.
        </p>
        <p>
          You must respond to booking enquiries in a reasonable
          timeframe and provide guests with clear, accurate
          confirmation details. Any applicable booking agreement,
          payment arrangements and cancellation conditions must be
          communicated clearly before the guest commits.
        </p>
        <p>
          If a booking cannot be honoured, contact the guest promptly
          and take the steps required by the booking agreement and
          applicable law. Notify Static Holidays where necessary to
          correct the listing or help communicate relevant information.
        </p>

        <h2>10. Guest communication and accommodation</h2>
        <p>
          You are responsible for providing the accommodation and
          facilities promised under your booking agreement. You must
          provide accurate check-in information, emergency contact
          details and reasonable instructions for using the property.
        </p>
        <p>
          You must deal appropriately with maintenance issues,
          cleanliness, complaints, safety concerns and any material
          problem affecting a guest's stay.
        </p>
        <p>
          You must treat guests fairly and comply with applicable
          equality, consumer protection, health and safety and other
          relevant laws. You must not discriminate unlawfully or
          use misleading or abusive communications.
        </p>

        <h2>11. Cancellations, deposits and refunds</h2>
        <p>
          You must establish clear, fair and lawful booking and
          cancellation conditions before accepting reservations.
          These must be consistent with the information presented
          to guests at the time of booking and with applicable law.
        </p>
        <p>
          You are responsible for applying the cancellation terms
          relevant to your booking, subject to any legal rights that
          cannot be excluded. Any deposit retained, cancellation
          charge or other amount claimed must be contractually
          justified, lawful and proportionate.
        </p>
        <p>
          If you cancel a confirmed booking or cannot provide the
          accommodation, you must communicate promptly and comply
          with your contractual and legal obligations, including
          arranging any refund that is due through the party
          responsible under the payment arrangements.
        </p>
        <div className="cp-note">
          <strong>Refunds:</strong> Static Holidays does not itself
          authorise, issue or process refunds on an owner's behalf.
          Owners and the relevant contracting or payment parties
          remain responsible for the obligations that apply to them.
          Do not tell guests that Static Holidays will pay a refund
          unless a separate written arrangement expressly provides
          for that role.
        </div>

        <h2>12. Guest deposits and property damage</h2>
        <p>
          If you require a security deposit or make a claim for damage,
          you must disclose the applicable conditions clearly and
          follow the booking agreement and applicable law.
        </p>
        <p>
          Any deduction should have a proper basis and be supported
          by reasonable evidence, such as photographs, invoices or
          other relevant records. You must not automatically retain
          a deposit without considering the circumstances and the
          applicable terms.
        </p>
        <p>
          You are responsible for communicating deposit decisions
          and returning any amount that is due under the booking
          arrangements. Static Holidays does not itself hold or
          release deposits unless a separate written agreement
          expressly states otherwise.
        </p>

        <h2>13. Guest personal data and privacy</h2>
        <p>
          You may receive guest names, contact details, booking
          information and other personal data when managing enquiries
          or stays. You must use that information only for lawful,
          appropriate purposes and handle it securely.
        </p>
        <p>You must, where applicable:</p>
        <ul>
          <li>Comply with UK data protection law and other applicable privacy requirements.</li>
          <li>Provide guests with the privacy information required for your own processing.</li>
          <li>Collect only information reasonably needed for a lawful purpose.</li>
          <li>Restrict access to people who need the information.</li>
          <li>Keep personal information secure and retain it only as long as justified.</li>
          <li>Not sell guest information or use it for unrelated marketing without a lawful basis and any required consent.</li>
          <li>Notify the appropriate parties promptly if a personal data breach affects information you handle.</li>
        </ul>
        <p>
          Your data-protection responsibilities depend on how you
          use guest information and whether you act as a controller,
          joint controller or processor for a particular activity.
          The parties should assess and document their actual roles
          rather than assume one role applies to every situation.
        </p>
        <p>
          Please also review our{" "}
          <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>

        <h2>14. Taxes, records and reporting</h2>
        <p>
          You are responsible for determining and meeting your own
          tax, accounting, registration and reporting obligations
          arising from letting your property. These may vary according
          to your location, business structure, income and letting
          arrangements.
        </p>
        <p>
          Keep accurate records of bookings, income, expenses, taxes,
          invoices and other documents relevant to your obligations.
          Obtain independent tax or accounting advice if you are
          unsure of the requirements.
        </p>
        <p>
          Where applicable law requires a platform to collect,
          verify or report owner or property information, you must
          provide accurate information and reasonably cooperate
          with lawful requests. We will explain any information
          required from you and the relevant purpose where required
          by law.
        </p>

        <h2>15. Inspections, records and verification</h2>
        <p>
          You must keep required licences, safety records, insurance
          documents and other relevant evidence current for as long
          as the relevant obligation applies.
        </p>
        <p>
          Where reasonably necessary for verification, safety,
          fraud prevention, a legal obligation or enforcement of
          these terms, we may request relevant information or
          documents. We may ask you to correct inaccurate
          information or explain a discrepancy.
        </p>
        <p>
          You must not submit forged, altered, expired or misleading
          documents, or claim that a document verifies something
          it does not. We do not guarantee that reviewing a document
          amounts to an independent inspection or certification
          of the property.
        </p>

        <h2>16. Complaints, incidents and cooperation</h2>
        <p>
          You must respond promptly and reasonably to guest complaints,
          safety incidents, reports of damage and lawful requests for
          information. Serious safety concerns or circumstances
          affecting a confirmed stay should be addressed without delay.
        </p>
        <p>
          Where an issue relates to your accommodation, you remain
          responsible for resolving it to the extent required by
          your agreement and applicable law. Static Holidays may
          facilitate communication or review a listing, but does
          not guarantee a particular dispute outcome.
        </p>

        <h2>17. Prohibited activity</h2>
        <p>You must not:</p>
        <ul>
          <li>List a property without the necessary authority or permissions.</li>
          <li>Provide false identity details or misleading documents.</li>
          <li>Misrepresent the property's condition, facilities, location or availability.</li>
          <li>Use photographs or content without appropriate rights.</li>
          <li>Discriminate unlawfully against guests.</li>
          <li>Engage in fraud, harassment, threats or other unlawful conduct.</li>
          <li>Misuse guest information or attempt unauthorised access to accounts or systems.</li>
          <li>Advertise accommodation that you know presents an unresolved serious safety risk.</li>
          <li>Make claims about certification, insurance or legal compliance that you cannot substantiate.</li>
        </ul>

        <h2>18. Listing suspension or removal</h2>
        <p>
          We may restrict, suspend or remove a listing, or limit
          access to the platform, where reasonably necessary because
          of suspected fraud, misleading information, a serious
          safety concern, missing required documentation, a legal
          requirement or a material breach of these terms.
        </p>
        <p>
          Where appropriate and lawful, we may request clarification
          or allow an opportunity to correct a problem. We may need
          to act immediately where safety, legal obligations or
          potential harm make delay inappropriate.
        </p>
        <p>
          A suspension or removal does not automatically cancel
          existing accommodation agreements or remove rights and
          obligations owed to guests. You remain responsible for
          addressing affected bookings in accordance with the
          relevant terms and law.
        </p>

        <h2>19. Intellectual property and platform use</h2>
        <p>
          You retain rights you hold in your own listing materials.
          By submitting materials, you grant Static Holidays
          permission to use, reproduce, display and distribute
          those materials as reasonably necessary to operate,
          promote and maintain the listing and platform, subject
          to any separate agreement and applicable law.
        </p>
        <p>
          You confirm that you have the rights needed to grant
          this permission. You must not copy, scrape, interfere
          with or misuse the platform or another person's content
          without appropriate authority.
        </p>

        <h2>20. Liability and responsibility</h2>
        <p>
          You remain responsible for your property, the accuracy
          of your listing, your conduct as an owner and your
          obligations under each accommodation agreement.
        </p>
        <p>
          To the extent permitted by law, Static Holidays is not
          responsible for an owner's failure to provide accommodation,
          a property's condition, an owner's legal compliance or
          disputes arising from an accommodation agreement between
          an owner and a guest.
        </p>
        <p>
          Nothing in these terms excludes or limits liability
          where doing so would be unlawful, including any rights
          or remedies that cannot lawfully be excluded. Any
          separate limitation of liability must be clear and
          legally enforceable.
        </p>

        <h2>21. Changes to these terms</h2>
        <p>
          We may update these terms when our platform, services or
          legal obligations change. Where an update materially
          affects owners, we will provide notice where required
          by law or applicable agreement.
        </p>
        <p>
          The version applicable to a particular listing or
          commercial arrangement may also be affected by a
          separate written agreement. If you have concerns about
          an update, contact us to clarify how it affects your
          listing and any existing bookings.
        </p>

        <h2>22. Governing law and disputes</h2>
        <p>
          The applicable law and courts will depend on the
          circumstances, the parties and any enforceable agreement.
          Nothing in these terms is intended to override mandatory
          consumer protections or other laws that apply regardless
          of a contractual choice of law.
        </p>
        <p>
          Before starting formal proceedings, the parties may
          attempt to resolve a dispute through written
          communication. This does not prevent either party
          from exercising a legal right or seeking urgent relief.
        </p>

        <h2>23. Contact Static Holidays</h2>
        <p>
          For questions about owner listings, verification
          documents or these terms, contact:
        </p>
        <p>
          <strong>Static Holidays</strong><br />
          Email:{" "}
          <a href="mailto:infostaticholidays@gmail.com">
            infostaticholidays@gmail.com
          </a>
        </p>

        <div className="cp-note">
          <strong>Before listing your property:</strong> Make sure
          you have the authority to let it, all required permissions
          and safety arrangements are in place, your listing is
          accurate, and your applicable documents are current.
        </div>

        <h2>Related policies</h2>
        <p>
          Please also read our other platform policies:
        </p>
        <ul>
          <li><Link to="/booking-terms">Booking Terms &amp; Conditions</Link></li>
          <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/cookie-policy">Cookie Policy</Link></li>
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
          <Link to="/cancellation-policy">Cancellation Policy</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/contact">Contact</Link>
        </p>
        <p>© {new Date().getFullYear()} Static Holidays</p>
      </footer>
    </div>
  );
}
