import React from 'react';
import Footer from '../components/Footer'; // Adjust this path if your Footer component is located elsewhere
import {
    accountFormCard,
  accountMainContainer,
  agreementContainer,
  agreementContainer1,
  agreementHeader,
  footeraccountMainContainer
} from '../styles/MasterCSSClass';

const TermsOfUse = () => {
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
             
        <div className={agreementContainer1} >
            
            {/* Header */}
            <div className={agreementHeader}>
              Terms of Services
            </div>

            <p>
             Effective and last updated <span className="font-semibold text-slate-900">{currentDate}</span>
            </p>

            {/* Introduction Paragraphs */}
            <div className="space-y-4 text-slate-800 text-[13px] leading-relaxed">
              <p>
                For the purposes of these Terms, “ShowIsHere” refers to SIH Tech Private Limited, the owner and operator of www.showishere.com, a company incorporated under the laws of India and having its registered office at 16 Feet Road, Boardghar, North 24 Parganas, West Bengal – 700110.
              </p>
              <p>
                These Terms of Service (“Terms”) govern your access to and use of the ShowIsHere Platform, including its website, applications and related services (“Platform”).
              </p>
              <p>
                Please read these Terms carefully. By accessing or using the Platform, you acknowledge and agree to be bound by these Terms and the Privacy Policy. If you do not agree with any provision of these Terms, you must discontinue use of the Platform.
              </p>
              <p>
                These Terms apply to all users of the Platform and shall be read together with ShowIsHere’s Privacy Policy, which forms an integral part hereof.
              </p>
              <p>
                ShowIsHere may amend these Terms from time to time by posting the revised version on the Platform. Your continued use of the Platform after such amendment shall constitute acceptance of the revised Terms.
              </p>
            </div>

            {/* Numbered Terms Sections */}
            <div className="space-y-3 pt-4 text-slate-800 text-[13px] leading-relaxed">
              <p>
                1. Persons incompetent to contract under the Indian Contract Act, 1872 shall not use the Platform, while minors below 18 years may use it only under the supervision and responsibility of a legally competent parent or guardian, and all users must comply with these Terms, applicable laws, and the rights of ShowIsHere and third parties.
              </p>
              <p>
                2. The terms “Service” or “Services” shall mean the online and mobile services, information and features provided by ShowIsHere through its Platform, including access to information and content made available through the Platform.
              </p>
              <p>
                3. You shall not copy, reproduce, distribute, sell, resell, duplicate or commercially exploit any part of the Services without the prior written consent of ShowIsHere.
              </p>
              <p>
                4. All users must register and maintain accurate account details to use the Platform and make transactions. By registering, users consent to receive transactional, promotional, and service-related communications, with the option to opt out.
              </p>
              <p>
                5. You must provide accurate and current information when registering and shall be responsible for maintaining the confidentiality and security of your account credentials. You shall not share your password, OTP, PIN or other confidential credentials with any third party and shall immediately notify ShowIsHere if your credentials are compromised.
              </p>
              <p>
                6. ShowIsHere may use the contact details provided by Users to send transactional and service-related communications necessary for providing the Services.
              </p>
              <p>
                7. Where required by applicable law, ShowIsHere may send promotional or marketing communications only where you have provided the required consent or opted in. You may withdraw such consent at any time in accordance with the Privacy Policy.
              </p>
              <p>
                8. ShowIsHere provides Event Organizers with a web-based platform to create and manage events, sell tickets, facilitate attendee registration, and process payments. ShowIsHere acts solely as a ticketing intermediary and is not responsible for event execution, venue arrangements, security, seating, or the conduct of the Event Organizer or its representatives.
              </p>
              <p>
                9. ShowIsHere may provide its Products and Services on a transaction-based model or on such other terms as may be agreed with the Organizer or customer.
              </p>
              <p>
                10. ShowIsHere reserves the right to levy listing, transaction, service or other applicable fees for the Services and to revise such fees from time to time. The applicable fees shall be communicated or displayed on the Platform.
              </p>
              <p>
                11. You shall be solely responsible for payment of all applicable fees, charges, taxes, duties, levies and other statutory amounts arising from or relating to the use of the Services.
              </p>
              <p>
                12. Tickets purchased through ShowIsHere may be subject to a per-ticket internet handling fee and a non-refundable processing fee per order, as applicable.
              </p>
              <p>
                13. All prices displayed on ShowIsHere are subject to applicable taxes, service fees, convenience fees and other charges, where applicable. The total payable amount will be displayed before completion of the transaction.
              </p>
              <p>
                14. If you do not receive a booking confirmation after making payment, or encounter an error or interruption during the transaction, you must verify the booking status through your ShowIsHere account or by contacting Customer Support before making another booking.
              </p>
              <p>
                15. Payments may be processed through third-party payment providers. ShowIsHere shall not be responsible for failures, delays or interruptions attributable to third-party payment systems, except to the extent required by applicable law.
              </p>
              <p>
                16. Without prejudice to any other remedies available under these Terms or applicable law, ShowIsHere may limit, suspend or terminate your account or access to the Platform, or Services if you breach these Terms, provide unverifiable information, violate applicable law or third-party rights, or engage in conduct that may cause harm or liability to you, other users or ShowIsHere.
              </p>
              <p>
                17. These Terms do not establish any partnership, agency, joint venture, employment or other legal relationship between you and ShowIsHere, and neither party is authorized to represent or bind the other.
              </p>
              <p>
                18. Your privacy is governed by our Privacy Policy, which explains how we collect, use, disclose and protect personal data.
              </p>
              <p>
                19. ShowIsHere reserves the right to request the removal of any link to the Platform at any time. Upon receiving such a request, you shall promptly remove the specified link(s).
              </p>
              <p>
                20. We aim to keep ShowIsHere available and functioning properly but do not guarantee that the Services will always be uninterrupted, error-free or available at all times. We may suspend, modify or discontinue any part of the Platform or Services where reasonably necessary.
              </p>
              <p>
                21. All notices under these Terms may be issued in writing by email, courier, registered post or other electronic means to the contact details provided by the parties.
              </p>
              <p>
                22. Notices to ShowIsHere shall be sent to showishereofficial@gmail.com or the address specified on the Platform. Notices to Users shall be sent to their registered contact details and shall be deemed served upon successful delivery or transmission.
              </p>
              <p>
                23. You are advised to review all applicable censor ratings, age restrictions, entry requirements and other conditions before purchasing tickets. ShowIsHere shall not be responsible if you are denied entry due to your failure to meet or comply with such requirements.
              </p>
              <p>
                24. Only booking IDs generated through www.showishere.com shall be recognized as valid by ShowIsHere. Tickets shall be sold only at the prices displayed on the Platform, subject to applicable fees and charges.
              </p>
              <p>
                25. ShowIsHere will never request your PIN, password, OTP or other confidential credentials by phone, email or any other means outside the authorized transaction process.
              </p>
              <p>
                26. To the extent permitted by applicable law, ShowIsHere shall not be liable for any indirect, incidental, consequential, special or punitive loss or damage arising from your use of, or inability to use, the Platform or Services. ShowIsHere’s total liability shall not exceed the amount paid by you for the relevant Service.
              </p>
              <p>
                27. The views and opinions expressed in content available on the Platform are those of the respective creators and do not necessarily represent the views of ShowIsHere. Any content classifications or disclaimers are provided for convenience and may not be completely accurate. You and, where applicable, your parent or legal guardian are responsible for exercising appropriate discretion regarding access to such content.
              </p>
              <p>
                28. These Terms shall be governed by and construed in accordance with the laws of India. Subject to applicable law, the competent courts at Kolkata, West Bengal, India shall have jurisdiction over disputes arising from or relating to these Terms or the Services.
              </p>
            </div>

            {/* Closing Agreement Acceptance Note */}
            <p>
              By accessing, registering with, or using ShowIsHere, you confirm that you have read, understood and agreed to these Terms & Conditions and any additional terms applicable to specific products, services, events or promotions.
            </p>

           
          </div>
        </div>
        </div>
        </div>
     

      {/* Replaced with your original main website Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfUse;