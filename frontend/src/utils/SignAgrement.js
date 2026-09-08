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
  sigImgPreviewTag,
  agreementContainer1
} from '../styles/MasterCSSClass';

const SignAgrement = ({
  signingDate = "",
  organizerName = "",
  organizerLocation = "",
  organizerPan = "",
  organizerGst = "",
  organizerType = "Individual",
  bankAccountName = "",
  bankName = "",
  bankAccountNumber = "",
  bankIfsc = "",
  signatoryEmail = "",
  signedDateTime = "",
  signedIp = "",
  signatureImage = null,
  onCreateSignature = () => {},
  onDeleteSignature = () => {}
}) => {
  return (
    <div className={agreementContainer}>
      <div className={agreementContainer1}>
        <div className={agreementHeader}>
          AGREEMENT
        </div>

        <p>
          This agreement is made on this <span className="font-semibold text-slate-900">{signingDate || "28 day of August, 2026"}</span> by and between:
        </p>

        <p>
          <span className="font-semibold text-slate-900">The Emunity Solutions Pvt. Ltd.</span>, a company incorporated under the Indian Companies Act, 2013 having its registered office located at 16 Feet Road, Boardghar, North 24 Parganas, West Bengal 700110 (hereinafter referred to as &ldquo;ShowIsHere&rdquo;, which expression shall unless repugnant to the context or meaning thereof be deemed to include a reference to its successors and permitted assigns);
        </p>

        <p>And</p>

        <p>
          <span className="font-semibold text-slate-900">{organizerName || 'Event Org'}</span>, a Company incorporated under the Companies Act 2013 or an individual having its registered office located at {organizerLocation || 'Address'} PAN: {organizerPan || 'ABCD123F'} GST: {organizerGst || 'N/A'} (hereinafter referred to as <span className="font-semibold text-slate-900">&apos;Event Organizer&apos;</span> which expression shall unless repugnant to the context or meaning thereof be deemed to include a reference to its successors and permitted assigns);
        </p>

        <p>
          ShowIsHere and Event Organizer shall hereinafter be individually referred to as a <span className="font-semibold text-slate-900">&apos;Party&apos;</span> and collectively as the <span className="font-semibold text-slate-900">&apos;Parties&apos;</span>.
        </p>

        <div className={`${agreementSectionTitle} font-semibold text-slate-900`}>Recitals:</div>
        <p>a. The Event (as defined herein) is owned and organized by the Event Organizer, which has appointed itself/the requisite persons for managing and conducting the Event.</p>
        <p>b. ShowIsHere is engaged in the business of providing online ticket booking services through its digital platforms (showishere.com), enabling customers to remotely reserve / book tickets for various entertainment events without the necessity of accessing any physical ticketing outlet or point of sale.</p>
        <p>c. The Event Organizer has approached ShowIsHere for availing its ticketing services, pursuant to which the Parties have agreed to enter into this Agreement to set forth the terms and conditions governing the online/remote booking and sale of tickets for the Event and matters incidental thereto.</p>

       <p className="pt-2">
        <span className="font-semibold text-slate-900">NOW THEREFORE,</span> in consideration of the mutual covenants, promises and obligations contained herein, the Parties, intending to be legally bound, hereby agree as follows:
      </p>

        {/* 1. Definitions */}
        <div className="space-y-3 pt-2">
          <h3 className="font-semibold text-slate-900">1. Definitions</h3>
          <p>Unless the context otherwise requires, the following expressions shall have the meanings set out below:</p>
          <p>1.1 <span className="font-semibold text-slate-900">&lsquo;Confidential Information&rsquo;</span> means and includes all information of a confidential or proprietary nature disclosed by either Party, whether directly or indirectly, to the other Party or its directors, employees, representatives, advisors or consultants, in connection with this Agreement, including, without limitation, business and commercial information, technical information, data, ideas, concepts, know-how, processes, designs, specifications, drawings, software, reports, studies, Intellectual Property Rights and other proprietary information, whether disclosed orally, in writing, electronically, digitally or in any other form.</p>
          <p>1.2 <span className="font-semibold text-slate-900">&lsquo;Customers&rsquo;</span> means any individual or entity that purchases, reserves, receives or otherwise obtains a Ticket through the ShowIsHere Platform or through any authorized sales channel.</p>
          <p>1.3 <span className="font-semibold text-slate-900">&lsquo;Event&rsquo;</span> means the event or events listed by the Event Organizer through the ShowIsHere Platform.</p>
          <p>1.4<span className="font-semibold text-slate-900"> &lsquo;Event Date&rsquo;</span> means the date or dates scheduled by the Event Organizer for the holding of the Event and notified to ShowIsHere from time to time.</p>
          <p>1.5<span className="font-semibold text-slate-900"> &lsquo;Event Content&rsquo;</span> means all text, photographs, videos, artwork, logos, trademarks, descriptions, artist information, venue information, schedules, prices and other materials supplied by or on behalf of the Event Organizer.</p>
          <p>1.6<span className="font-semibold text-slate-900"> &lsquo;Venue&rsquo;</span> means the physical or virtual location(s) as informed by Event Organizer to ShowIsHere in writing from time to time.</p>
          <p>1.7<span className="font-semibold text-slate-900"> &lsquo;Intellectual Property Rights&rsquo;</span> means all rights in and to copyrights, trademarks, trade names, logos, domain names, designs, patents, inventions, databases, software, know-how, trade secrets and all other intellectual property or proprietary rights, whether registered or unregistered, together with all applications, registrations, renewals, extensions and modifications thereof.</p>
          <p>1.8<span className="font-semibold text-slate-900"> &lsquo;Ticket&rsquo;</span> means a physical or electronic ticket, reservation, pass, QR code, booking confirmation or other entitlement made through the Platform that permits the holder to attend or access the applicable Event subject to the Event terms.</p>
          <p>1.9<span className="font-semibold text-slate-900"> &lsquo;Losses&rsquo;</span> shall mean and include all losses, damages, liabilities, claims, demands, penalties, costs, charges, expenses and disbursements of any nature whatsoever, whether actual or incurred, including reasonable legal fees and expenses arising out of or in connection with the investigation, defence, settlement, appeal or enforcement of any claim, action or proceeding.</p>
          <p>1.10<span className="font-semibold text-slate-900"> &lsquo;Force Majeure Event&rsquo;</span> means an event beyond the reasonable control of the affected Party, including natural disasters, flood, fire, epidemic, pandemic, war, terrorism, riots, civil disturbance, governmental restrictions, lockdown, judicial orders, changes in law, technical infrastructure failure, telecommunications failure or other similar circumstances.</p>
        </div>

        {/* 2. Appointment and Services */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">2. Appointment and Services</h3>
          <p>2.1 The Event Organizer hereby appoints ShowIsHere, to provide the following Platform (<span className="font-semibold text-slate-900">&lsquo;Services&rsquo;</span>) in connection with the Event(s), subject to this Agreement and the applicable Commercial Terms.</p>
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
          <p>2.7 ShowIsHere shall use commercially reasonable efforts to maintain the availability and functioning of the ShowIsHere Platform. However, the Platform may occasionally be unavailable due to maintenance, upgrades, network failures, third-party service interruptions, security requirements, force majeure events or other circumstances beyond ShowIsHere&apos;s reasonable control.</p>
        </div>

        {/* 3. Right to Review and Delist */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">3. Right to Review and Delist</h3>
          <p>3.1 ShowIsHere may review Event Content before or after publication. Publication of an Event shall not constitute an endorsement, guarantee or certification of the Event.</p>
          <p>3.2 ShowIsHere may refuse to publish, suspend, modify visibility of or remove an Event or Event Content(s) where:</p>
          <p className="pl-4">a. the information is inaccurate or misleading;</p>
          <p className="pl-4">b. the Event or Content appears to violate Applicable Law;</p>
          <p className="pl-4">c. required permissions or documentation are not provided;</p>
          <p className="pl-4">d. there is a reasonable concern regarding public safety, fraud or customer harm;</p>
          <p className="pl-4">e. the Event may infringe third-party Intellectual Property Rights;</p>
          <p className="pl-4">f. the Event Organizer breaches this Agreement; or</p>
          <p className="pl-4">g. ShowIsHere reasonably considers such action necessary to protect Customers, the Platform or its reputation.</p>
          <p>Where reasonably practicable, ShowIsHere shall notify the Event Organizer of such action.</p>
        </div>

        {/* 4. Responsibility of Event Organizer */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">4. Responsibility of Event Organizer</h3>
          <p>4.1 The Event Organizer shall be solely responsible for end to end activities of the Event.</p>
          <p>4.2 Without limitation, the Event Organizer shall:</p>
          <p className="pl-4">a. provide complete, accurate and up-to-date information regarding the Event;</p>
          <p className="pl-4">b. notify ShowIsHere of all discounts, schemes and benefits that it intends to offer in relation to Tickets at online itself at Event Organizer convenience and in case of totally taking care by ShowIsHere for marketing and sale such cases;</p>
          <p className="pl-4">c. obtain, at its sole cost and expense, all necessary approvals, permissions, licenses, no-objection certificates, clearances and statutory authorizations from the relevant governmental and regulatory authorities as may be required for the lawful conduct of the Event and availing of the Services, and any failure to obtain or maintain the same shall constitute a material breach of this Agreement;</p>
          <p className="pl-4">d. take all reasonable and necessary steps to ensure the safety, security and welfare of Customers, staff, artists and other attendees;</p>
          <p className="pl-4">e. immediately notify ShowIsHere of any postponement, cancellation, venue change, timing change, material change or other circumstance affecting Customers;</p>
          <p className="pl-4">f. defend at its cost, any suit, claim or action brought against ShowIsHere in connection with the Services or the Event having regard to the expense and effort that the Event Manager would have reasonably invested as if the said suit, claim or action has been brought against it;</p>
          <p className="pl-4">g. be solely responsible for any injury, death, property damage (whether owned or contracted), loss or claim arising from the organization or conduct of the Event, except to the extent caused solely by ShowIsHere&apos;s proven wilful misconduct;</p>
          <p className="pl-4">h. ensure that the Venue is suitable for the Event and has adequate facilities, access, exits, security, emergency arrangements and other infrastructure reasonably required for the Event;</p>
          <p className="pl-4">i. be responsible for handling and resolving all Customer complaints relating to the Event and shall remain responsible for all complaints arising from the quality of the Event, cancellation, postponement, entry, Venue conditions, performer-related issues or any other matters within the Organizer’s control, in accordance with the terms agreed herein or as may be communicated by ShowIsHere from time to time.</p>
          <p className="pl-4">j. not involve in any illegal or unfair trade business;</p>
          <p className="pl-4">k. not deny entry to a Customer holding a valid Ticket except for lawful and reasonable grounds, including fraud, duplication, invalidation, safety requirements or violation of published Event terms;</p>
          <p className="pl-4">l. comply with all Applicable Laws relating to the Event, including laws and regulations concerning public safety, fire safety, local permissions, taxation, consumer protection, intellectual property and other applicable requirements.</p>
          <p>4.3 Without prejudice to any rights of ShowIsHere, Event Manager shall promptly notify ShowIsHere if it is unable to fulfill its obligations mentioned above, whether or not on account of reasons attributable to it.</p>
        </div>

        {/* 5. Responsibility of ShowIsHere */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">5. Responsibility of ShowIsHere</h3>
          <p>5.1 ShowIsHere shall render the Services in a professional and competent manner.</p>
        </div>

        {/* 6. Consideration and Payment Terms */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">6. Consideration and Payment Terms</h3>
          <p>6.1 Subject to the terms of this Agreement, ShowIsHere shall be entitled to charge the Event Organizer a commission fee of 7% (seven percent) plus applicable Taxes on the total Ticketing Revenue (the “Convenience Fee”). This fee covers applicable payment gateway charges and platform fees and will be automatically deducted from the Event Organizer’s ticket sales payouts.</p>
          <p>6.2 ShowIsHere may charge Customers a separate booking or other applicable service fee in addition to the Ticket price, where applicable. Unless otherwise agreed in writing, such fee shall not form part of the Event Organizer&apos;s Gross Ticket Revenue.</p>
          <p>6.3 Organizer-funded discounts shall be deducted from the Event Organizer&apos;s settlement.</p>
          <p>6.4 ShowIsHere-funded promotions shall be subject to separately agreed terms.</p>
          <p>6.5 Upon completion of the Event, the ShowIsHere shall raise an invoice on the Event Organizer for the amount of Consideration.</p>
          <p>6.6 ShowIsHere shall settle Net Revenue payable to the Event Organizer within forty-eight (48) hours upon completion of the post-Event reconciliation.</p>
          <p>6.7 ShowIsHere may hold a reasonable reserve from settlement amounts where required to cover anticipated refunds, chargebacks, disputes or other financial liabilities.</p>
          <p>6.8 The Event Organizer shall promptly notify ShowIsHere of any discrepancy in a settlement statement.</p>
        </div>

        {/* 7. Cancellation of the Event */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">7. Cancellation of the Event</h3>
          <p>7.1 Any change to the Event Date, Venue, or any material change to the Event schedule may, at ShowIsHere’s discretion, be treated as a cancellation and/or a new Event listing for ticketing purposes.</p>
          <p>7.2 The Event Organizer may cancel any particular Event without terminating this Agreement by providing ShowIsHere with an email notice of cancellation at least forty-eight (48) hours before the date from which the Event is intended to be removed from the Ticketing Platform.</p>
          <p>7.3 All Ticket bookings made through this Ticketing Platform shall be non-cancellable and non-refundable, except that Tickets shall be eligible for refund in the event of cancellation of the relevant Event.</p>
          <p>7.4 In the event of cancellation of the Event for any reason, ShowIsHere shall be entitled to levy a cancellation fee of 5% (five percent) of the Gross Ticket Revenue, plus applicable Taxes, as specified in Schedule 2, without prejudice to any other rights or remedies available to ShowIsHere under this Agreement or applicable law.</p>
          <p>7.5 The Cancellation Charge shall not apply if the cancellation is solely caused by a technical glitch in the Ticketing Platform or an error during the Ticket booking process on the Ticketing Platform.</p>
          <p>7.6 If ShowIsHere is required to process any refund of the Ticket price or any other amount to customers (the ‘Refund Amount’) under Clause 7.3 or otherwise, the Event Organizer shall pay the full Refund Amount to ShowIsHere within three (03) working days of receiving written notice from ShowIsHere.</p>
          <p>7.7 If the Event Organizer fails, neglects or refuses to remit the Refund Amount within this period, ShowIsHere may, without prejudice to and in addition to any other rights, recover or adjust the outstanding Refund Amount from the Advance Amount or any other amount payable to the Event Organizer under this Agreement.</p>
          <p>7.8 The Event Organizer shall be responsible for all applicable taxes and statutory liabilities arising from such refunds.</p>
        </div>

        {/* 8. Limitation of Liability */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">8. Limitation of Liability of ShowIsHere</h3>
          <p>8.1 ShowIsHere shall not be liable to any third party for any direct, indirect, incidental, special, punitive or consequential loss or damage, including loss of profits, revenue, business or opportunities, arising out of or in connection with this Agreement, except as expressly provided herein.</p>
          <p>8.2 ShowIsHere shall not be liable for any loss arising from errors, delays, interruptions, defects, non-delivery or failure of its Services.</p>
          <p>8.3 The Event Organizer shall be solely responsible for the accuracy of all Event-related information, including Ticket prices and charges, as well as customer support, payments, invoicing, collections, delivery and after-sales services, and shall bear all related costs and expenses.</p>
        </div>

        {/* 9. Intellectual Property Right */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">9. Intellectual Property Right</h3>
          <p>9.1 Subject to Clause 9.2, each Party agrees and acknowledges to retain all rights, title and ownership in its respective copyrights, trademarks, software, service marks, trade secrets and other intellectual property (‘Intellectual Property’).</p>
          <p>9.2 Either Party may use the other Party’s name or trademark only for advertisements, promotional materials or other Event-related collateral. The Event Organizer shall obtain ShowIsHere’s prior written approval before using ShowIsHere’s name, trademark or logo and shall use only the approved logos.</p>
          <p>9.3 Neither Party shall do anything that may infringe, damage or adversely affect the other Party’s Intellectual Property, rights, reputation or goodwill.</p>
        </div>

        {/* 10. Term, Breach and Termination */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">10. Term, Breach and Termination</h3>
          <p>10.1 Unless otherwise mutually agreed and extended in writing by the Parties, this Agreement shall commence on the Effective Date and remain in force for the term specified in Schedule 2, unless terminated earlier in accordance with the terms of this Agreement.</p>
          <p>10.2 Either Party may terminate this Agreement by giving thirty (30) days&apos; prior written notice, provided that termination shall not affect Events already sold or obligations accrued before termination unless otherwise agreed.</p>
          <p>10.3 ShowIsHere may terminate this Agreement without notice and without any liability at any time in case of any damage and/or threatened damage to its goodwill and/or business reputation by Event Organizer. Additionally, ShowIsHere has a right to de-list the Event at any time for any reason whatsoever without incurring any liability.</p>
          <p>10.4 Consequences of termination or expiry of the Agreement:</p>
          <p className="pl-4">a. ShowIsHere shall be entitled to immediately de-list the Event and discontinue the display of advertisements relating to the Event displayed on its Platforms, if any.</p>
          <p className="pl-4">b. Parties shall cease to use the Intellectual Property of the other Party.</p>
          <p className="pl-4">c. Pay all the outstanding dues within ten (10) days’ from termination.</p>
          <p>10.5 Termination of this Agreement shall be without prejudice to any rights accrued by Parties prior to termination hereof.</p>
        </div>

        {/* 11. Force Majeure */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">11. Force Majeure</h3>
          <p>11.1 Neither Party shall be liable for delay or failure to perform its obligations to the extent caused by an event beyond its reasonable control, including natural disasters, fire, flood, earthquake, epidemic, pandemic, war, terrorism, civil unrest, governmental restrictions, strikes, failure of utilities or communications infrastructure, or other similar events.</p>
          <p>11.2 The affected Party shall notify the other Party as soon as reasonably practicable and use reasonable efforts to mitigate the effects of the Force Majeure Event (&lsquo;Force Majeure&rsquo;).</p>
          <p>11.3 If the Force Majeure Event continues for thirty (30) day's the affected Party may terminate this Agreement by written notice, or the Parties may mutually agree to extend the Agreement on revised terms.</p>
        </div>

        {/* 12. Indemnification */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">12. Indemnification</h3>
          <p>12.1 Each Party shall indemnify the other for losses arising from any breach of its representations, warranties, or covenants. Neither Party shall be liable for any indirect or consequential losses.</p>
          <p>12.2 This Clause shall survive termination of this Agreement.</p>
        </div>

        {/* 13. Confidentiality */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">13. Confidentiality</h3>
          <p>13.1 Each Party shall keep all proprietary, confidential information and Intellectual Property received from the other Party (‘Confidential Information’) confidential and shall:</p>
          <p className="pl-4">a. disclose such information only to its employees, officers, directors, agents and contractors on a need-to-know basis, subject to confidentiality obligations;</p>
          <p className="pl-4">b. not disclose such information to any third party without the prior written consent of the disclosing Party, except where the information is publicly available or disclosure is required by law or a court/tribunal order.</p>
          <p>13.2 All customer data collected by or in the possession of ShowIsHere shall remain the property of ShowIsHere, and the Event Organizer shall have no right, title or interest in such data.</p>
          <p>13.3 This Clause shall survive and remain effective after termination of this Agreement.</p>
        </div>

        {/* 14. Taxes */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">14. Taxes</h3>
          <p>14.1 Each Party shall be responsible for tax(es) applicable to its own income and activities.</p>
          <p>14.2 GST and other indirect tax(es) shall be handled in accordance with applicable law.</p>
          <p>14.3 Where applicable under prevailing tax laws, ShowIsHere shall deduct TDS from payments or settlements made to the Event Organizer. Such TDS shall be deposited with the Government and reflected in the organizer’s Form 26AS, subject to applicable law.</p>
        </div>

        {/* 15. Governing Law */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">15. Governing Law and Dispute Resolution</h3>
          <p>15.1 This Agreement shall be governed by and construed in accordance with the laws of India.</p>
          <p>15.2 The Parties shall first attempt to resolve any dispute through good-faith discussions.</p>
          <p>15.3 If the dispute is not resolved within thirty (30) day's of written notice, the courts at Kolkata, West Bengal shall have exclusive jurisdiction, subject to any mandatory provisions of Applicable Law.</p>
        </div>

        {/* 16. Amendment & 17. Severability */}
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-slate-900">16. Amendment  </h3>
          <p>16. No amendment to this Agreement shall be effective unless made in writing and accepted by both Parties, except for updates to generally applicable ShowIsHere Platform policies where such updates are permitted by the applicable terms and communicated through the Platform or other reasonable means.</p>
          <h3 className="font-semibold text-slate-900">17. Severability</h3><p>17.1 If any provision or part thereof of this Agreement is held invalid, illegal or unenforceable, the remaining provisions shall continue in full force and effect.</p>
          <p>17.2 The Parties shall endeavour to replace the invalid provision with a valid provision that most closely reflects the original commercial intention. No delay or omission by ShowIsHere in enforcing or performing any of the terms or conditions of this Agreement shall be construed as or constitute a waiver of obligations of Event Organizer under this Agreement.</p>
        </div>
      </div>

      {/* ANNEXURE A TABLE */}
      <div>
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-slate-900 tracking-wide text-xs">ANNEXURE A</h3>
          <h4 className="font-semibold text-slate-800 text-xs">PRE-EVENT OPERATIONAL &amp; COMPLIANCE CHECKLIST</h4>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className={annexureTableClass}>
            <thead>
              <tr className={annexureTableHeader}>
                <th className={`${annexureTableCell} w-14 text-center font-semibold`}>Sl. No.</th>
                <th className={`${annexureTableCell} w-28 text-left font-semibold`}>Category</th>
                <th className={`${annexureTableCell} text-left font-semibold`}>Checkpoint</th>
                <th className={`${annexureTableCell} w-44 text-left font-semibold`}>Benchmark / Requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${annexureTableCell} text-center`}>1</td>
                <td className={annexureTableCell}>Ticketing</td>
                <td className={annexureTableCell}>Ticket format finalized</td>
                <td className={annexureTableCell}>M-Ticket / QR Ticket / Digital Ticket</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.1</td>
                <td className={annexureTableCell} rowSpan="3">Event Planning</td>
                <td className={annexureTableCell}>Event layout finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.2</td>
                <td className={annexureTableCell}>Stage/screen location finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.3</td>
                <td className={annexureTableCell}>Seating/zone layout finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.4</td>
                <td className={annexureTableCell} rowSpan="3">Timing</td>
                <td className={annexureTableCell}>Event timing finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.5</td>
                <td className={annexureTableCell}>Gate opening time finalized</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.6</td>
                <td className={annexureTableCell}>Event duration communicated</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.7</td>
                <td className={annexureTableCell} rowSpan="3">Facilities</td>
                <td className={annexureTableCell}>Parking information available</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.8</td>
                <td className={annexureTableCell}>Washroom availability communicated</td>
                <td className={annexureTableCell}>Yes</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.9</td>
                <td className={annexureTableCell}>Food and beverage information communicated</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>2.10</td>
                <td className={annexureTableCell}>Accessibility</td>
                <td className={annexureTableCell}>Accessibility/PWD arrangements communicated</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>3.1</td>
                <td className={annexureTableCell}>Parking</td>
                <td className={annexureTableCell}>Adequate parking</td>
                <td className={annexureTableCell}>Appropriate to venue capacity</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>3.2</td>
                <td className={annexureTableCell} rowSpan="2">Entry/Exit</td>
                <td className={annexureTableCell}>Entry/exit and pickup/drop-off areas</td>
                <td className={annexureTableCell}>Clearly designated</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>3.3</td>
                <td className={annexureTableCell}>Venue and gate information</td>
                <td className={annexureTableCell}>Clearly communicated</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>3.4</td>
                <td className={annexureTableCell}>Signage</td>
                <td className={annexureTableCell}>Directional signage</td>
                <td className={annexureTableCell}>Adequate and visible</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>4.1</td>
                <td className={annexureTableCell} rowSpan="2">Pre-Entry</td>
                <td className={annexureTableCell}>Holding/waiting area</td>
                <td className={annexureTableCell}>Where reasonably required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>4.2</td>
                <td className={annexureTableCell}>Drinking water</td>
                <td className={annexureTableCell}>Available where reasonably required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>5.1</td>
                <td className={annexureTableCell} rowSpan="4">Entry</td>
                <td className={annexureTableCell}>Separate access for applicable zones</td>
                <td className={annexureTableCell}>Yes, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>5.2</td>
                <td className={annexureTableCell}>Adequate ingress capacity</td>
                <td className={annexureTableCell}>Appropriate to expected attendance</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>5.3</td>
                <td className={annexureTableCell}>Ticket scanning equipment</td>
                <td className={annexureTableCell}>Tested and operational</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>5.4</td>
                <td className={annexureTableCell}>Manual contingency procedure</td>
                <td className={annexureTableCell}>Available</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>6.1</td>
                <td className={annexureTableCell} rowSpan="2">Viewing</td>
                <td className={annexureTableCell}>Unreasonable obstruction of view</td>
                <td className={annexureTableCell}>Avoided where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>6.2</td>
                <td className={annexureTableCell}>Screens/displays</td>
                <td className={annexureTableCell}>Provided where reasonably required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>7.1</td>
                <td className={annexureTableCell} rowSpan="3">F&amp;B</td>
                <td className={annexureTableCell}>Drinking water availability</td>
                <td className={annexureTableCell}>Adequate</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>7.2</td>
                <td className={annexureTableCell}>Food access</td>
                <td className={annexureTableCell}>As communicated to Customers</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>7.3</td>
                <td className={annexureTableCell}>Menu and pricing visibility</td>
                <td className={annexureTableCell}>Clear, where applicable</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>8.1</td>
                <td className={annexureTableCell} rowSpan="2">Washrooms</td>
                <td className={annexureTableCell}>Adequate washroom access</td>
                <td className={annexureTableCell}>Appropriate to attendance and Applicable Law</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>8.2</td>
                <td className={annexureTableCell}>Housekeeping</td>
                <td className={annexureTableCell}>Adequate staffing</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>8.3</td>
                <td className={annexureTableCell}>Hygiene</td>
                <td className={annexureTableCell}>Hand wash / sanitizer</td>
                <td className={annexureTableCell}>Available where appropriate</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>9.1</td>
                <td className={annexureTableCell} rowSpan="3">Emergency &amp; Security</td>
                <td className={annexureTableCell}>Emergency exits</td>
                <td className={annexureTableCell}>Clearly identified and accessible</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>9.2</td>
                <td className={annexureTableCell}>First-aid arrangements</td>
                <td className={annexureTableCell}>Available</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>9.3</td>
                <td className={annexureTableCell}>Security personnel</td>
                <td className={annexureTableCell}>Appropriate to Event risk and attendance</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>10</td>
                <td className={annexureTableCell}>On-site Support</td>
                <td className={annexureTableCell}>On-site customer helpdesk/contact</td>
                <td className={annexureTableCell}>Available</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>11</td>
                <td className={annexureTableCell}>Accessibility</td>
                <td className={annexureTableCell}>Wheelchair/PWD accessibility</td>
                <td className={annexureTableCell}>Where applicable and required</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>12</td>
                <td className={annexureTableCell}>Permissions</td>
                <td className={annexureTableCell}>Venue and statutory approvals</td>
                <td className={annexureTableCell}>Obtained before Event</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>13</td>
                <td className={annexureTableCell}>Insurance</td>
                <td className={annexureTableCell}>Appropriate insurance</td>
                <td className={annexureTableCell}>Obtained where required or commercially appropriate</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>14</td>
                <td className={annexureTableCell}>Communication</td>
                <td className={annexureTableCell}>Emergency contact persons</td>
                <td className={annexureTableCell}>Shared with relevant teams</td>
              </tr>
              <tr>
                <td className={`${annexureTableCell} text-center`}>15</td>
                <td className={annexureTableCell}>Ticketing</td>
                <td className={annexureTableCell}>Final inventory reconciliation</td>
                <td className={annexureTableCell}>Completed before gates open</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULES & SIGNATURE BLOCKS */}
      <div className={signatureBlockWrapper}>
        <div className="space-y-4 pt-4 text-slate-800">
          {/* Centered Schedule 1 Headers */}
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-slate-900">SCHEDULE 1</h3>
            <p className="font-semibold text-slate-900 text-xs underline">PARTICULARS OF THE EVENT ORGANIZER</p>
          </div>
          
          {/* Left-aligned content with dynamic variables */}
          <div className="space-y-1 text-[13px] text-slate-800">
            <p>a. Name of company/proprietor/individual: {organizerName || 'N/A'}</p>
            <p>b. Type of company: {organizerType || 'Individual'}</p>
            <p>c. Registered office address: {organizerLocation || 'N/A'}</p>
            <p>d. Name of the authorized signatory: {organizerName || 'N/A'}</p>
            <p>e. GST number: {organizerGst || 'N/A'}</p>
            <p>f. PAN Number: {organizerPan || 'N/A'}</p>
            <p>g. Bank Account Details: {bankAccountName || organizerName || 'N/A'}, {bankName || 'N/A'}, {bankAccountNumber || 'N/A'}, {bankIfsc || 'N/A'}</p>
          </div>

          {/* Centered Schedule 2 Headers */}
          <div className="text-center space-y-1 pt-4">
            <h4 className="font-semibold text-slate-900">SCHEDULE 2</h4>
            <p className="font-semibold text-slate-900 text-sm underline">Commercial Arrangement</p>
          </div>

          {/* Left-aligned content */}
          <div className="space-y-2 text-[13px] text-slate-800">
            <p><strong className="font-semibold text-slate-900">1. Terms:</strong> Subject to the provisions of Clause 10, the term of this Agreement shall commence on the Effective Date and shall continue for a period of twelve (12) months or until all payment obligations of the Parties are fully discharged, whichever is later.</p>
            <p><strong className="font-semibold text-slate-900">2. Cancellation Charge</strong> (As per Clause 7.4 of Agreement if applicable): 5%</p>
            <p><strong className="font-semibold text-slate-900">3. Payment Terms:</strong> 7% Commission</p>
            <p><strong className="font-semibold text-slate-900">4. Notices:</strong></p>
            <p>Any notice, request, demand, or other communication under this Agreement shall be in writing and in English, and delivered by hand or email to the addresses specified below, or such other address as notified in writing by either Party.</p>
            <p>In the case of notice to ShowIsHere, to:</p>
            <p>
              Attention: H. Pathak<br />
              E mail: showishereofficial@gmail.com<br />
              Address: Flat 13G, Tower 16, Alcove New Kolkata Sangam, 449/A/1 &amp; 2, G.T. Road, Mahesh, Hooghly, West Bengal – 712202
            </p>
            <p>In the case of notice to Event Organizer, to:</p>
            <p>
              Attention: {organizerName || 'N/A'}<br />
              E mail: {signatoryEmail || 'N/A'}<br />
              Address: {organizerLocation || 'N/A'}
            </p>
          </div>
        </div>

        <p className="text-slate-900 leading-normal text-[13px] py-8">
          IN WITNESS WHEREOF, the duly authorized representatives of the Parties have executed this Agreement on the date, month and year first hereinabove written.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-2">
          {/* Left Side Details */}
          <div className="space-y-1 text-slate-800 text-[13px]">
            <p className="font-semibold text-slate-900">For {organizerName || 'Event Org'}</p>
            <p className="font-semibold text-slate-900 pt-1">Authorized Signatory:</p>
            <br></br>
            <p><span className="font-semibold text-slate-900">Signatory email:</span> <span className="font-normal">{signatoryEmail || 'abc@gmail.com'}</span></p>
            <p><span className="font-semibold text-slate-900">Signed at:</span> <span className="font-normal">{signatureImage ? (signedDateTime || '26th August 2026, 09:17 pm') : ''}</span></p>
            <p className="break-all"><span className="font-semibold text-slate-900">Signed with IP:</span> <span className="font-normal">{signatureImage ? (signedIp || '') : ''}</span></p>
          </div>
          {/* Right Side Signature Action / Preview Box */}
          <div className="w-full md:w-auto min-w-[240px] flex flex-col items-center">
            {signatureImage ? (
              <div className="flex flex-col space-y-2 w-[240px]">
                <div className={signatureBoxContainer}>
                  <img src={signatureImage} alt="Digital Signature" className={sigImgPreviewTag} />
                </div>
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-xs font-medium text-slate-800">Signature</span>
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
                <span className="text-xs font-medium text-slate-600">Signature</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-300 my-6"></div>

        {/* Company Footer Info */}
        <div className="space-y-1  text-slate-800 text-[13px]">
          <p className="font-semibold text-slate-900">Emunity Solutions Private Limited</p>
          <p><span className="font-semibold text-slate-900">Registered Address:</span> <span className="font-normal">16 Feet Road, Boardghar, North 24 Parganas, West Bengal 700110</span></p>
          <p><span className="font-semibold text-slate-900">CIN:</span> <span className="font-normal">U72900WB2021PTC243736</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignAgrement;