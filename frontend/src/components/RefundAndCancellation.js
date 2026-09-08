import React from 'react';
import Footer from '../components/Footer';
import {
  accountFormCard,
  agreementContainer,
  agreementContainer1,
  agreementHeader,
  footeraccountMainContainer
} from '../styles/MasterCSSClass';

const RefundAndCancellation = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div>
      <div className={footeraccountMainContainer}>
        <div className={accountFormCard}>
          <div className={agreementContainer}>
            <div className={agreementContainer1}>
              
              {/* Header */}
              <div className={agreementHeader}>
                Cancellation and Refund Policy
              </div>

              <p>
                Effective and last updated <span className="font-semibold text-slate-900">{currentDate}</span>
              </p>

              {/* Content Body */}
              <div className="space-y-4 text-slate-800 text-[13px] leading-relaxed">
                
                {/* Section 1 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">1. Role of ShowIsHere</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">1.1</span> ShowIsHere acts as a technology-enabled event ticketing platform and facilitates the sale and distribution of Tickets on behalf of the relevant Event Organizer.</p>
                    <p><span className=" text-slate-900">1.2</span> Unless expressly agreed otherwise in writing, ShowIsHere does not organize, manage or control the Event and does not independently decide whether an Event should be cancelled, postponed, rescheduled or refunded.</p>
                    <p><span className=" text-slate-900">1.3</span> All decisions regarding Event cancellation, postponement, rescheduling and refund eligibility are the responsibility of the respective Event Organizer, subject to Applicable Law and the terms communicated to Customers.</p>
                  </div>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">2. Refund Eligibility</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">2.1</span> A Customer may be eligible for a refund in the following circumstances:</p>
                    <div className="space-y-1.5 pl-4">
                      <p><span className=" text-slate-900">a.</span> The Event is officially cancelled by the Event Organizer.</p>
                      <p><span className=" text-slate-900">b.</span> The Event is postponed or rescheduled and the Customer is unable to attend the Event on the revised date, where the Event Organizer has approved refunds for such circumstances.</p>
                      <p><span className=" text-slate-900">c.</span> The Event Organizer has specifically approved a refund request under conditions applicable to that Event.</p>
                      <p><span className=" text-slate-900">d.</span> A refund is otherwise required under Applicable Law.</p>
                    </div>
                    <p className="pt-1"><span className=" text-slate-900">2.2</span> Refund eligibility may vary depending on the specific Event and the refund terms communicated to Customer(s) at the time of Ticket purchase.</p>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">3. Refund Approval</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">3.1</span> ShowIsHere does not independently approve refunds on behalf of the Event Organiser.</p>
                    <p><span className=" text-slate-900">3.2</span> Where an Event Organizer has prescribed specific refund conditions, the Customer's refund request shall be considered in accordance with those conditions.</p>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">4. Refund Processing Time</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">4.1</span> Once a refund has been approved and the necessary refund instruction has been received, ShowIsHere shall generally initiate the refund within 3–5 Working Days.</p>
                    <p><span className=" text-slate-900">4.2</span> After the refund has been initiated, the Customer's bank, card issuer, payment gateway or other payment service provider may require an additional 2–3 Working Days, or longer depending on the provider, to credit the amount to the Customer's account.</p>
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">5. Refund Method and Currency</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">5.1</span> Approved refunds will ordinarily be credited to the original payment method used for the Ticket purchase.</p>
                    <p><span className=" text-slate-900">5.2</span> All refunds processed through ShowIsHere shall be made in Indian Rupees (INR).</p>
                  </div>
                </div>

                {/* Section 6 */}
                <div>
                  <p>
                    <span className=" text-slate-900">6.</span> Only Tickets purchased directly through the ShowIsHere Platform or an officially authorized ShowIsHere ticketing channel shall be eligible for refund processing through ShowIsHere. Tickets purchased through unauthorized third parties or unauthorized resellers shall not be eligible for refund processing by ShowIsHere.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <p>
                    <span className=" text-slate-900">7.</span> ShowIsHere may communicate the cancellation and applicable refund procedure to affected Customers using the contact information associated with their Booking.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">8. Event Postponement or Rescheduling</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">8.1</span> If an Event is postponed or rescheduled, the Event Organizer shall determine the applicable policy regarding existing Tickets.</p>
                    <p><span className=" text-slate-900">8.2</span> Where the Event Organizer permits refunds for Customers who cannot attend the revised date, eligible Customers may request a refund in accordance with the applicable procedure.</p>
                    <p><span className=" text-slate-900">8.3</span> A postponement or rescheduling does not automatically guarantee a refund unless the Event Organizer’s policy or Applicable Law provides for one.</p>
                  </div>
                </div>

                {/* Section 9 */}
                <div>
                  <p>
                    <span className=" text-slate-900">9.</span> Event-specific cancellation and refund terms displayed to Customers at or before Booking shall apply to the extent of any inconsistency with this Schedule, subject to Applicable Law.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">10. Customer Responsibility</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">10.1</span> Customers are responsible for providing accurate booking and payment information and for retaining their Ticket, Booking ID and transaction details.</p>
                    <p><span className=" text-slate-900">10.2</span> Where a refund has been initiated successfully by ShowIsHere, Customers should allow the applicable processing time before raising a refund-related complaint.</p>
                  </div>
                </div>

                {/* Section 11 */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">11. General Conditions</h3>
                  <div className="space-y-2 pl-4">
                    <p><span className=" text-slate-900">11.1</span> This Cancellation & Refund Policy shall be read together with the applicable Event terms and conditions displayed at the time of Ticket purchase.</p>
                    <p><span className=" text-slate-900">11.2</span> Where Event-specific cancellation or refund terms apply, those terms shall govern the relevant Event to the extent permitted by Applicable Law.</p>
                    <p><span className=" text-slate-900">11.3</span> Nothing in this Policy shall exclude or restrict any right or remedy available to a Customer under Applicable Law.</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Website Footer */}
      <Footer />
    </div>
  );
};

export default RefundAndCancellation;