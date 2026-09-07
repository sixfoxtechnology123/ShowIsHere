import React from 'react';
import {
  agreementContainer,
  agreementHeader,
  agreementSectionTitle,
  annexureTableClass,
  annexureTableHeader,
  annexureTableCell,
  signatureBlockWrapper,
  signatureBoxContainer,
  signatureEmptyBox,
  sigCreateBtn,
  sigDeleteButtonStyled,
  sigImgPreviewTag
} from '../styles/MasterCSSClass';

const SignAgrement = ({
  signingDate = "28 day of August, 2026",
  organizerName = "Debabrata Mandal",
  organizerLocation = "Kolkata",
  organizerPan = "BMQPM2573K",
  organizerGst = "19BMQPM2573K1ZB",
  signatoryEmail = "sbrta.roy@gmail.com",
  signedDateTime = "26th August 2026, 09:17 pm",
  signedIp = "2001:4490:4045:21cf:fcca:cf5f:b24e:fbd5",
  signatureImage = null,
  onCreateSignature = () => {},
  onDeleteSignature = () => {}
}) => {
  return (
    <div className={agreementContainer}>
      <div className={agreementHeader}>
        EVENT TICKETING &amp; SERVICES AGREEMENT
      </div>

      <p className="font-semibold text-slate-800">
        PLEASE READ THIS TICKETING SERVICES AGREEMENT CAREFULLY.
      </p>

      <p>
        This agreement is made on this <strong>{signingDate}</strong> (Signing Date) between:
      </p>

      <p>
        <strong>The Emunity Solutions Pvt. Ltd.</strong>, a company incorporated under the Indian Companies Act, 2013 having its registered office located at Kolkata (hereinafter referred to as 'ShowIsHere', which expression shall unless repugnant to the context or meaning thereof be deemed to include a reference to its successors and permitted assigns);
      </p>

      <p className="text-center font-semibold text-slate-500">And</p>

      <p>
        <strong>{organizerName}</strong>, a Company incorporated under the Companies Act 2013 or an individual having its registered office located at {organizerLocation} PAN: {organizerPan} GST: {organizerGst} (hereinafter referred to as 'Event Organizer' which expression shall unless repugnant to the context or meaning thereof be deemed to include a reference to its successors and permitted assigns);
      </p>

      <p>
        ShowIsHere and Event Organizer shall hereinafter be individually referred to as a 'Party' and collectively as the 'Parties'.
      </p>

      <div className={agreementSectionTitle}>Recitals:</div>
      <p>a. The Event (as defined herein) is owned and organized by the Event Organizer, which has appointed itself/the requisite persons for managing and conducting the Event.</p>
      <p>b. ShowIsHere is engaged in the business of providing online ticket booking services through its digital platforms (showishere.com), enabling customers to remotely reserve / book tickets for various entertainment events without the necessity of accessing any physical ticketing outlet or point of sale.</p>
      <p>c. The Event Organizer has approached ShowIsHere for availing its ticketing services, pursuant to which the Parties have agreed to enter into this Agreement to set forth the terms and conditions governing the online/remote booking and sale of tickets for the Event and matters incidental thereto.</p>

      <p className="font-semibold text-slate-800 pt-2">NOW THEREFORE, in consideration of the mutual covenants, promises and obligations contained herein, the Parties, intending to be legally bound, hereby agree as follows:</p>

      {/* 1. Definitions */}
      <div className="space-y-3 pt-2">
        <h3 className="font-semibold text-slate-800">1. Definitions</h3>
        <p>Unless the context otherwise requires, the following expressions shall have the meanings set out below:</p>
        <p><strong>1.1 ‘Confidential Information’</strong> means and includes all information of a confidential or proprietary nature disclosed by either Party, whether directly or indirectly, to the other Party or its directors, employees, representatives, advisors or consultants, in connection with this Agreement, including, without limitation, business and commercial information, technical information, data, ideas, concepts, know-how, processes, designs, specifications, drawings, software, reports, studies, Intellectual Property Rights and other proprietary information, whether disclosed orally, in writing, electronically, digitally or in any other form.</p>
        <p><strong>1.2 ‘Customers’</strong> means any individual or entity that purchases, reserves, receives or otherwise obtains a Ticket through the ShowIsHere Platform or through any authorized sales channel.</p>
        <p><strong>1.3 ‘Event’</strong> means the event or events listed by the Event Organizer through the ShowIsHere Platform.</p>
        <p><strong>1.4 ‘Event Date’</strong> means the date or dates scheduled by the Event Organizer for the holding of the Event and notified to ShowIsHere from time to time.</p>
        <p><strong>1.5 ‘Event Content’</strong> means all text, photographs, videos, artwork, logos, trademarks, descriptions, artist information, venue information, schedules, prices and other materials supplied by or on behalf of the Event Organizer.</p>
        <p><strong>1.6 ‘Venue’</strong> means the physical or virtual location(s) as informed by Event Organizer to ShowIsHere in writing from time to time.</p>
        <p><strong>1.7 ‘Intellectual Property Rights’</strong> means all rights in and to copyrights, trademarks, trade names, logos, domain names, designs, patents, inventions, databases, software, know-how, trade secrets and all other intellectual property or proprietary rights, whether registered or unregistered, together with all applications, registrations, renewals, extensions and modifications thereof.</p>
        <p><strong>1.8 ‘Ticket’</strong> means a physical or electronic ticket, reservation, pass, QR code, booking confirmation or other entitlement made through the Platform that permits the holder to attend or access the applicable Event subject to the Event terms.</p>
        <p><strong>1.9 ‘Losses’</strong> shall mean and include all losses, damages, liabilities, claims, demands, penalties, costs, charges, expenses and disbursements of any nature whatsoever, whether actual or incurred, including reasonable legal fees and expenses arising out of or in connection with the investigation, defence, settlement, appeal or enforcement of any claim, action or proceeding.</p>
        <p><strong>1.20 ‘Force Majeure Event’</strong> means an event beyond the reasonable control of the affected Party, including natural disasters, flood, fire, epidemic, pandemic, war, terrorism, riots, civil disturbance, governmental restrictions, lockdown, judicial orders, changes in law, technical infrastructure failure, telecommunications failure or other similar circumstances.</p>
      </div>

      {/* 2. Appointment and Services */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">2. Appointment and Services</h3>
        <p>2.1 The Event Organizer hereby appoints ShowIsHere, to provide the following Platform (‘Services’) in connection with the Event(s), subject to this Agreement and the applicable Commercial Terms.</p>
        <p>2.2 Subject to the terms and conditions of this Agreement, ShowIsHere may provide some or all of the following Ticketing Services:</p>
        <p className="pl-4">a. facilitate creation and listing of Events on the ShowIsHere Platform;</p>
        <p className="pl-4">b. enable creation of Ticket categories, prices, quantities and sale periods;</p>
        <p className="pl-4">c. facilitate online and remote sale or reservation of Tickets;</p>
        <p className="pl-4">d. provide QR-code, mobile-ticket or other digital ticketing functionality;</p>
        <p className="pl-4">e. maintain and manage Ticket inventory through the Creator Dashboard or other systems;</p>
        <p className="pl-4">f. provide sales and inventory reports;</p>
        <p className="pl-4">g. facilitate ticket validation, redemption or scanning, where such services are agreed;</p>
        <p className="pl-4">h. provide access to the Creator Dashboard;</p>
        <p className="pl-4">i. collect Ticket amounts on behalf of the Event Organizer, subject to this Agreement;</p>
        <p className="pl-4">j. facilitate refunds where applicable;</p>
        <p className="pl-4">k. provide customer-facing ticketing communications and transactional notifications;</p>
        <p className="pl-4">l. provide promotional, marketing, advertising or discovery services only where separately agreed; and</p>
        <p className="pl-4">m. provide box-office, on-ground staffing, equipment or other event-day support only where separately agreed in writing.</p>
        <p>2.3 ShowIsHere is not responsible for booking of Tickets through any medium or at any location or any physical point of sale other than the following platform.</p>
        <p>2.4 ShowIsHere may provide promotional or marketing support upon request and subject to separate agreement.</p>
        <p>2.5 ShowIsHere does not guarantee any minimum number of Ticket sales, revenue, audience attendance, Event popularity, visibility, marketing performance or commercial success.</p>
        <p>2.6 Unless otherwise expressly agreed in writing, ShowIsHere acts as a technology and ticketing service provider facilitating transactions between the Event Organizer and Customers. The Event itself remains the sole responsibility of the Event Organizer.</p>
        <p>2.7 ShowIsHere shall use commercially reasonable efforts to maintain the availability and functioning of the ShowIsHere Platform. However, the Platform may occasionally be unavailable due to maintenance, upgrades, network failures, third-party service interruptions, security requirements, force majeure events or other circumstances beyond ShowIsHere's reasonable control.</p>
      </div>

      {/* 3. Right to Review and Delist */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">3. Right to Review and Delist</h3>
        <p>3.1 ShowIsHere may review Event Content before or after publication. Publication of an Event shall not constitute an endorsement, guarantee or certification of the Event.</p>
        <p>3.2 ShowIsHere may refuse to publish, suspend, modify visibility of or remove an Event or Event Content(s) where: (a) the information is inaccurate or misleading; (b) the Event or Content appears to violate Applicable Law; (c) required permissions or documentation are not provided; (d) there is a reasonable concern regarding public safety, fraud or customer harm; (e) the Event may infringe third-party Intellectual Property Rights; (f) the Event Organizer breaches this Agreement; or (g) ShowIsHere reasonably considers such action necessary to protect Customers, the Platform or its reputation.</p>
      </div>

      {/* 4. Responsibility of Event Organizer */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">4. Responsibility of Event Organizer</h3>
        <p>4.1 The Event Organizer shall be solely responsible for end to end activities of the Event.</p>
        <p>4.2 Without limitation, the Event Organizer shall:</p>
        <p className="pl-4">a. provide complete, accurate and up-to-date information regarding the Event;</p>
        <p className="pl-4">b. notify ShowIsHere of all discounts, schemes and benefits that it intends to offer in relation to Tickets at online itself at Event Organizer convenience and in case of totally taking care by ShowIsHere for marketing and sale such cases;</p>
        <p className="pl-4">c. obtain, at its sole cost and expense, all necessary approvals, permissions, licenses, no-objection certificates, clearances and statutory authorizations from the relevant governmental and regulatory authorities as may be required for the lawful conduct of the Event and availing of the Services;</p>
        <p className="pl-4">d. take all reasonable and necessary steps to ensure the safety, security and welfare of Customers, staff, artists and other attendees;</p>
        <p className="pl-4">e. immediately notify ShowIsHere of any postponement, cancellation, venue change, timing change, material change or other circumstance affecting Customers;</p>
        <p className="pl-4">f. defend at its cost, any suit, claim or action brought against ShowIsHere in connection with the Services or the Event;</p>
        <p className="pl-4">g. be solely responsible for any injury, death, property damage, loss or claim arising from the organization or conduct of the Event;</p>
        <p className="pl-4">h. ensure that the Venue is suitable for the Event and has adequate facilities, access, exits, security, and emergency arrangements;</p>
        <p className="pl-4">i. be responsible for handling and resolving all Customer complaints relating to the Event;</p>
        <p className="pl-4">j. not involve in any illegal or unfair trade business;</p>
        <p className="pl-4">k. not deny entry to a Customer holding a valid Ticket except for lawful and reasonable grounds;</p>
        <p className="pl-4">l. comply with all Applicable Laws relating to the Event, including public safety, fire safety, local permissions, taxation, and consumer protection.</p>
        <p>4.3 Without prejudice to any rights of ShowIsHere, Event Manager shall promptly notify ShowIsHere if it is unable to fulfill its obligations.</p>
      </div>

      {/* 5. Responsibility of ShowIsHere */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">5. Responsibility of ShowIsHere</h3>
        <p>5.1 ShowIsHere shall render the Services in a professional and competent manner.</p>
      </div>

      {/* 6. Consideration and Payment Terms */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">6. Consideration and Payment Terms</h3>
        <p>6.1 Subject to the terms of this Agreement, ShowIsHere shall be entitled to charge the Event Organizer a commission fee of 7% (seven percent) plus applicable Taxes on the total Ticketing Revenue (the “Convenience Fee”).</p>
        <p>6.2 ShowIsHere may charge Customers a separate booking or other applicable service fee in addition to the Ticket price.</p>
        <p>6.3 Organizer-funded discounts shall be deducted from the Event Organizer's settlement.</p>
        <p>6.4 ShowIsHere-funded promotions shall be subject to separately agreed terms.</p>
        <p>6.5 Upon completion of the Event, ShowIsHere shall raise an invoice on the Event Organizer for the amount of Consideration.</p>
        <p>6.6 ShowIsHere shall settle Net Revenue payable to the Event Organizer within forty-eight (48) hours upon completion of the post-Event reconciliation.</p>
        <p>6.7 ShowIsHere may hold a reasonable reserve from settlement amounts where required to cover anticipated refunds, chargebacks, disputes or other financial liabilities.</p>
        <p>6.8 The Event Organizer shall promptly notify ShowIsHere of any discrepancy in a settlement statement.</p>
      </div>

      {/* 7. Cancellation of the Event */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">7. Cancellation of the Event</h3>
        <p>7.1 Any change to the Event Date, Venue, or any material change to the Event schedule may, at ShowIsHere’s discretion, be treated as a cancellation and/or a new Event listing for ticketing purposes.</p>
        <p>7.2 The Event Organizer may cancel any particular Event without terminating this Agreement by providing ShowIsHere with an email notice of cancellation at least forty-eight (48) hours before.</p>
        <p>7.3 All Ticket bookings made through this Ticketing Platform shall be non-cancellable and non-refundable, except that Tickets shall be eligible for refund in the event of cancellation of the relevant Event.</p>
        <p>7.4 If the Event is cancelled for any reason, ShowIsHere shall be entitled to charge the Event Organizer a cancellation fee of 5% (five percent) of the Gross Ticket Revenue, plus applicable Taxes.</p>
        <p>7.5 The Cancellation Charge shall not apply if the cancellation is solely caused by a technical glitch in the Ticketing Platform.</p>
        <p>7.6 If ShowIsHere is required to process any refund of the Ticket price or any other amount to customers under Clause 7.3, the Event Organizer shall pay the full Refund Amount within three (03) working days.</p>
        <p>7.7 If the Event Organizer fails to remit the Refund Amount, ShowIsHere may recover or adjust it from any amount payable to the Event Organizer.</p>
        <p>7.8 The Event Organizer shall be responsible for all applicable taxes and statutory liabilities arising from such refunds.</p>
      </div>

      {/* 8. Limitation of Liability */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">8. Limitation of Liability of ShowIsHere</h3>
        <p>8.1 ShowIsHere shall not be liable to any third party for any direct, indirect, incidental, special, punitive or consequential loss or damage, including loss of profits, revenue, business or opportunities, except as expressly provided herein.</p>
        <p>8.2 ShowIsHere shall not be liable for any loss arising from errors, delays, interruptions, defects, non-delivery or failure of its Services.</p>
        <p>8.3 The Event Organizer shall be solely responsible for the accuracy of all Event-related information, including Ticket prices and charges, customer support, payments, invoicing, collections, delivery and after-sales services.</p>
      </div>

      {/* 9. Intellectual Property Right */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">9. Intellectual Property Right</h3>
        <p>9.1 Each Party retains all rights, title and ownership in its respective copyrights, trademarks, software, service marks, trade secrets and other intellectual property.</p>
        <p>9.2 Either Party may use the other Party’s name or trademark only for advertisements, promotional materials or other Event-related collateral with prior written approval.</p>
        <p>9.3 Neither Party shall do anything that may infringe, damage or adversely affect the other Party’s Intellectual Property, rights, reputation or goodwill.</p>
      </div>

      {/* 10. Term, Breach and Termination */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">10. Term, Breach and Termination</h3>
        <p>10.1 This Agreement shall commence on the Effective Date and remain in force until terminated in accordance with its terms.</p>
        <p>10.2 Either Party may terminate this Agreement by giving thirty (30) days' prior written notice.</p>
        <p>10.3 ShowIsHere may terminate this Agreement without notice and without any liability at any time in case of any damage and/or threatened damage to its goodwill and/or business reputation by Event Organizer.</p>
        <p>10.4 Consequences of termination: (a) ShowIsHere shall de-list the Event immediately; (b) Parties shall cease to use the IP of the other Party; (c) Pay all outstanding dues within ten (10) days.</p>
        <p>10.5 Termination shall be without prejudice to any rights accrued prior to termination.</p>
      </div>

      {/* 11. Force Majeure */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">11. Force Majeure</h3>
        <p>11.1 Neither Party shall be liable for delay or failure to perform its obligations to the extent caused by an event beyond its reasonable control (natural disasters, fire, flood, war, terrorism, government restrictions, strikes).</p>
        <p>11.2 The affected Party shall notify the other Party as soon as reasonably practicable and use reasonable efforts to mitigate effects.</p>
        <p>11.3 If the Force Majeure Event continues for thirty (30) days, the affected Party may terminate this Agreement by written notice.</p>
      </div>

      {/* 12. Indemnification */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">12. Indemnification</h3>
        <p>12.1 Each Party shall indemnify the other for losses arising from any breach of its representations, warranties, or covenants.</p>
        <p>12.2 This Clause shall survive termination of this Agreement.</p>
      </div>

      {/* 13. Confidentiality */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">13. Confidentiality</h3>
        <p>13.1 Each Party shall keep all proprietary, confidential information and IP confidential and restrict disclosures on a need-to-know basis.</p>
        <p>13.2 All customer data collected by or in the possession of ShowIsHere shall remain the property of ShowIsHere.</p>
        <p>13.3 This Clause shall survive and remain effective after termination.</p>
      </div>

      {/* 14. Taxes */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">14. Taxes</h3>
        <p>14.1 Each Party shall be responsible for tax(es) applicable to its own income and activities.</p>
        <p>14.2 GST and other indirect tax(es) shall be handled in accordance with applicable law.</p>
        <p>14.3 Where applicable, ShowIsHere shall deduct TDS from payments made to the Event Organizer and deposit it with the Government.</p>
      </div>

      {/* 15. Governing Law */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">15. Governing Law and Dispute Resolution</h3>
        <p>15.1 This Agreement shall be governed by and construed in accordance with the laws of India.</p>
        <p>15.2 Parties shall first attempt to resolve disputes through good-faith discussions.</p>
        <p>15.3 If unresolved within thirty (30) days, courts at Kolkata, West Bengal shall have exclusive jurisdiction.</p>
      </div>

      {/* 16. Amendment & 17. Severability */}
      <div className="space-y-2 pt-2">
        <h3 className="font-semibold text-slate-800">16. Amendment &amp; 17. Severability</h3>
        <p>16. No amendment shall be effective unless made in writing and accepted by both Parties.</p>
        <p>17.1 If any provision is held invalid, the remaining provisions shall continue in full force and effect.</p>
      </div>

      {/* ANNEXURE A TABLE */}
      <div className="pt-6 border-t border-slate-200 space-y-3">
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-slate-900 tracking-wide text-xs">ANNEXURE A</h3>
          <h4 className="font-semibold text-slate-800 text-xs">PRE-EVENT OPERATIONAL &amp; COMPLIANCE CHECKLIST</h4>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className={annexureTableClass}>
            <thead>
              <tr className={annexureTableHeader}>
                <th className={`${annexureTableCell} w-14 text-center`}>Sl. No.</th>
                <th className={`${annexureTableCell} w-28 text-left`}>Category</th>
                <th className={`${annexureTableCell} text-left`}>Checkpoint</th>
                <th className={`${annexureTableCell} w-44 text-left`}>Benchmark / Requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>1</td>
                <td className={`${annexureTableCell} font-medium`}>Ticketing</td>
                <td className={annexureTableCell}>Ticket format finalized</td>
                <td className={annexureTableCell}>M-Ticket / QR Ticket / Digital Ticket</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.1</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="3">Event Planning</td>
                <td className={annexureTableCell}>Event layout finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.2</td>
                <td className={annexureTableCell}>Stage/screen location finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.3</td>
                <td className={annexureTableCell}>Seating/zone layout finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.4</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="3">Timing</td>
                <td className={annexureTableCell}>Event timing finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.5</td>
                <td className={annexureTableCell}>Gate opening time finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.6</td>
                <td className={annexureTableCell}>Event duration communicated</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.7</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="3">Facilities</td>
                <td className={annexureTableCell}>Parking information available</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.8</td>
                <td className={annexureTableCell}>Washroom availability communicated</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.9</td>
                <td className={annexureTableCell}>Food and beverage information communicated</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>2.10</td>
                <td className={`${annexureTableCell} font-medium`}>Accessibility</td>
                <td className={annexureTableCell}>Accessibility/PWD arrangements communicated</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>3.1</td>
                <td className={`${annexureTableCell} font-medium`}>Parking</td>
                <td className={annexureTableCell}>Adequate parking</td>
                <td className={annexureTableCell}>Appropriate to venue capacity</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>3.2</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="2">Entry/Exit</td>
                <td className={annexureTableCell}>Entry/exit and pickup/drop-off areas</td>
                <td className={annexureTableCell}>Clearly designated</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>3.3</td>
                <td className={annexureTableCell}>Venue and gate information</td>
                <td className={annexureTableCell}>Clearly communicated</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>3.4</td>
                <td className={`${annexureTableCell} font-medium`}>Signage</td>
                <td className={annexureTableCell}>Directional signage</td>
                <td className={annexureTableCell}>Adequate and visible</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>4.1</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="2">Pre-Entry</td>
                <td className={annexureTableCell}>Holding/waiting area</td>
                <td className={annexureTableCell}>Where reasonably required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>4.2</td>
                <td className={annexureTableCell}>Drinking water</td>
                <td className={annexureTableCell}>Available where reasonably required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>5.1</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="4">Entry</td>
                <td className={annexureTableCell}>Separate access for applicable zones</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>5.2</td>
                <td className={annexureTableCell}>Adequate ingress capacity</td>
                <td className={annexureTableCell}>Appropriate to expected attendance</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>5.3</td>
                <td className={annexureTableCell}>Ticket scanning equipment</td>
                <td className={annexureTableCell}>Tested and operational</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>5.4</td>
                <td className={annexureTableCell}>Manual contingency procedure</td>
                <td className={annexureTableCell}>Available</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>6.1</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="2">Viewing</td>
                <td className={annexureTableCell}>Unreasonable obstruction of view</td>
                <td className={annexureTableCell}>Avoided where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>6.2</td>
                <td className={annexureTableCell}>Screens/displays</td>
                <td className={annexureTableCell}>Provided where reasonably required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>7.1</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="3">F&amp;B</td>
                <td className={annexureTableCell}>Drinking water availability</td>
                <td className={annexureTableCell}>Adequate</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>7.2</td>
                <td className={annexureTableCell}>Food access</td>
                <td className={annexureTableCell}>As communicated to Customers</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>7.3</td>
                <td className={annexureTableCell}>Menu and pricing visibility</td>
                <td className={annexureTableCell}>Clear, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>8.1</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="2">Washrooms</td>
                <td className={annexureTableCell}>Adequate washroom access</td>
                <td className={annexureTableCell}>Appropriate to attendance and Applicable Law</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>8.2</td>
                <td className={annexureTableCell}>Housekeeping</td>
                <td className={annexureTableCell}>Adequate staffing</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>8.3</td>
                <td className={`${annexureTableCell} font-medium`}>Hygiene</td>
                <td className={annexureTableCell}>Hand wash / sanitizer</td>
                <td className={annexureTableCell}>Available where appropriate</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>9.1</td>
                <td className={`${annexureTableCell} font-medium`} rowSpan="3">Emergency &amp; Security</td>
                <td className={annexureTableCell}>Emergency exits</td>
                <td className={annexureTableCell}>Clearly identified and accessible</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>9.2</td>
                <td className={annexureTableCell}>First-aid arrangements</td>
                <td className={annexureTableCell}>Available</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>9.3</td>
                <td className={annexureTableCell}>Security personnel</td>
                <td className={annexureTableCell}>Appropriate to Event risk and attendance</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>10</td>
                <td className={`${annexureTableCell} font-medium`}>On-site Support</td>
                <td className={annexureTableCell}>On-site customer helpdesk/contact</td>
                <td className={annexureTableCell}>Available</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>11</td>
                <td className={`${annexureTableCell} font-medium`}>Accessibility</td>
                <td className={annexureTableCell}>Wheelchair/PWD accessibility</td>
                <td className={annexureTableCell}>Where applicable and required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>12</td>
                <td className={`${annexureTableCell} font-medium`}>Permissions</td>
                <td className={annexureTableCell}>Venue and statutory approvals</td>
                <td className={annexureTableCell}>Obtained before Event</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>13</td>
                <td className={`${annexureTableCell} font-medium`}>Insurance</td>
                <td className={annexureTableCell}>Appropriate insurance</td>
                <td className={annexureTableCell}>Obtained where required or commercially appropriate</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>14</td>
                <td className={`${annexureTableCell} font-medium`}>Communication</td>
                <td className={annexureTableCell}>Emergency contact persons</td>
                <td className={annexureTableCell}>Shared with relevant teams</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center font-medium`}>15</td>
                <td className={`${annexureTableCell} font-medium`}>Ticketing</td>
                <td className={annexureTableCell}>Final inventory reconciliation</td>
                <td className={annexureTableCell}>Completed before gates open</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Block Area with Side-by-Side Layout */}
      <div className={signatureBlockWrapper}>
        <p className="font-semibold text-slate-900 leading-normal text-xs">
          IN WITNESS WHEREOF, the duly authorized representatives of the Parties have executed this Agreement on the date, month and year first hereinabove written.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-2">
          {/* Left Side Details */}
          <div className="space-y-1 font-medium text-slate-800 text-xs">
            <p className="font-semibold text-slate-900">Executed on behalf of the Restaurant Partner by its Authorized Signatory:</p>
            <p className="font-semibold text-slate-900 pt-1">Authorized Signatory:</p>
            <p>Signatory email: {signatoryEmail}</p>
            <p>Signed at: {signatureImage ? signedDateTime : ''}</p>
            <p className="break-all">Signed with IP: {signatureImage ? signedIp : ''}</p>
          </div>

          {/* Right Side Signature Action / Preview Box */}
          <div className="w-full md:w-auto min-w-[240px] flex flex-col items-center">
            {signatureImage ? (
              <div className="flex flex-col space-y-2 w-[240px]">
                <div className={signatureBoxContainer}>
                  <img src={signatureImage} alt="Digital Signature" className={sigImgPreviewTag} />
                </div>
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-xs font-semibold text-slate-800">Signature</span>
                  <button 
                    type="button" 
                    onClick={onDeleteSignature} 
                    className={sigDeleteButtonStyled}
                  >
                    Delete Signature
                  </button>
                </div>
              </div>
            ) : (
              <div className={signatureEmptyBox}>
                <button
                  type="button"
                  onClick={onCreateSignature}
                  className={sigCreateBtn}
                >
                  Create your signature
                </button>
                <span className="text-xs font-semibold text-slate-600">Signature</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-300 my-6"></div>

        {/* Company Footer Info */}
        <div className="space-y-1 font-medium text-slate-800 text-xs">
          <p className="font-semibold text-slate-900">WASTELAND ENTERTAINMENT PRIVATE LIMITED</p>
          <p><strong className="font-semibold text-slate-900">Registered Address:</strong> Pioneer Square, Tower 1- Ground to 6th Floor and Tower 2- 1st and 2nd Floor, Near Golf Course Extension, Sector-62, Gurugram, Haryana - 122098</p>
          <p><strong className="font-semibold text-slate-900">CIN:</strong> U74120MH2015PTC271160</p>
        </div>
      </div>
    </div>
  );
};

export default SignAgrement;