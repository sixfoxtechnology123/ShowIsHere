import React from 'react';
import Footer from '../components/Footer';
import {
  accountFormCard,
  agreementContainer,
  agreementContainer1,
  agreementHeader,
  footeraccountMainContainer
} from '../styles/MasterCSSClass';

const PrivacyPolicy = () => {
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
                Privacy Policy
              </div>

              <p className="mb-6">
                Effective and last updated <span className="font-semibold text-slate-900">{currentDate}</span>
              </p>

              {/* Content Body */}
              <div className="space-y-4 text-slate-800 text-[13px] leading-relaxed">
                
              <div>
                  <p>
                    <span>1.</span> ShowIsHere (&ldquo;ShowIsHere&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) respects your privacy and recognizes the need to protect personal information that may identify you, such as your name, email address, mobile number, address, payment-related information and other information you provide while using our Services.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <p>
                    <span>2.</span> In general, you can browse ShowIsHere without providing personal information. However, we may automatically track and analyze technical data such as your IP address, device, browser, and usage information to improve security and our services.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <p>
                    <span>3.</span> Services involving ticket purchases or other transactions are intended for individuals who are legally capable of entering into binding transactions under applicable law. Where a user is a minor, use of the Services shall be subject to applicable law and, where required, the involvement or consent of a parent or lawful guardian.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <p>
                    <span>4.</span> We may collect personal information when you create an account with ShowIsHere, purchase or manage tickets/events, contact us, join promotions or, subscribe to newsletters, participate in an event, or communicate with us through email, phone, messaging, social media, or other channels.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <p>
                    <span>5.</span> Where permitted by applicable law and, where required, with your consent, we may use your personal information to send marketing and promotional communications about ShowIsHere and our Services. You may opt out of such communications at any time by using the unsubscribe option provided in the communication.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <p>
                    <span>6.</span> ShowIsHere is committed to protecting children's privacy and safety online. We do not knowingly process personal data of children without obtaining the consent of a parent or lawful guardian where required by applicable law. For purposes of applicable Indian data-protection law, a child generally means an individual below 18 years of age. If you believe that a child has provided personal information to us without appropriate consent, please contact us so that we may take appropriate action.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <p className="mb-1">
                    7. When you access or use ShowIsHere, we may automatically collect certain information including:
                  </p>
                  <div className="space-y-1.5 pl-4">
                    <p><span>a.</span> IP address;</p>
                    <p><span>b.</span> browser type and version;</p>
                    <p><span>c.</span> operating system;</p>
                    <p><span>d.</span> device type and identifiers;</p>
                    <p><span>e.</span> language and time-zone;</p>
                    <p><span>f.</span> pages, events and content viewed;</p>
                    <p><span>g.</span> search queries;</p>
                    <p><span>h.</span> links and buttons clicked;</p>
                    <p><span>i.</span> date and time of access;</p>
                    <p><span>j.</span> session and usage information;</p>
                    <p><span>k.</span> referral information;</p>
                    <p><span>l.</span> crash reports and diagnostic information;</p>
                    <p><span>m.</span> approximate location information; and</p>
                    <p><span>n.</span> other technical or hardware information.</p>
                  </div>
                </div>

                {/* Section 8 */}
                <div>
                  <p>
                    <span>8.</span> We may receive information about you from third parties, such as event organizers, venues, promoters, payment providers, banks, authentication providers, social-media platforms, marketing and advertising partners, analytics providers, technology and service providers, and other partners. This information may include details such as your name, email address, and other information necessary to provide and improve our Services.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <p>
                    <span>9.</span> We may collect information about your website usage automatically through cookies, web beacons, analytics tools and similar technologies. These technologies may be used to understand usage patterns, improve our Services, maintain security and support relevant communications or advertising.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <p>
                    <span>10.</span> In order to provide our products and services and fulfil our contractual obligations, we may share your information with trusted third-party service providers, including payment processors, technology and hosting providers, data processors, customer-support providers, fraud-prevention providers, communication providers and fulfilment or delivery partners.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <p>
                    <span>11.</span> Where permitted by applicable law, we may share your information with advertising networks, social platforms, search engines, and analytics providers to support targeted advertising and analyze the effectiveness of our services.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <p>
                    <span>12.</span> ShowIsHere may contain links to third-party websites and services, such as identity verification and social media platforms. Any information you provide to these third parties is subject to their own privacy policies. ShowIsHere is not responsible for their content, security, or privacy practices, so we recommend reviewing their privacy policies before using them.
                  </p>
                </div>

                {/* Section 13 */}
                <div>
                  <p className="mb-1">
                    13. We may disclose personal data where reasonably necessary to:
                  </p>
                  <div className="space-y-1.5 pl-4">
                    <p><span>i.</span> comply with applicable laws, regulations, legal processes or lawful government requests;</p>
                    <p><span>ii.</span> respond to legal, regulatory, administrative or investigative proceedings;</p>
                    <p><span>iii.</span> protect the rights, safety, property and interests of ShowIsHere, its users, employees, partners or others;</p>
                    <p><span>iv.</span> detect, prevent or investigate fraud, misuse, security incidents or unlawful activities; or</p>
                    <p><span>v.</span> otherwise comply with or exercise rights available under applicable law.</p>
                  </div>
                </div>

                {/* Section 14 */}
                <div>
                  <p>
                    <span>14.</span> In sharing your personal data with such parties, we will take reasonable security measures to ensure that third parties protect your personal data from unauthorized access or misuse and retain it only as long as necessary for the relevant purpose or as required by applicable law.
                  </p>
                </div>

                {/* Section 15 */}
                <div>
                  <p>
                    <span>15.</span> You may opt out of cookies and tracking technologies by referring to Showishere’s Cookie Policy or updating your preferences through our cookie management tools. You may disable location tracking and push notifications through your device or browser settings, as applicable.
                  </p>
                </div>

                {/* Section 16 */}
                <div>
                  <p>
                    <span>16.</span> You may request correction or updating of your personal data by contacting us at support@showishere.com and we may accept or reject such requests in accordance with applicable law and shall, where required, provide reasons for any refusal.
                  </p>
                </div>

                {/* Section 17 */}
                <div>
                  <p>
                    <span>17.</span> ShowIsHere may update this Privacy Policy from time to time. Any changes will be published on this page with the revised effective or updated date. We encourage you to review this Policy periodically. For privacy-related queries, please mention “Privacy Policy” in the subject line and contact us at support@showishere.com.
                  </p>
                </div>

                {/* Section 18 */}
                <div>
                  <p className="mb-1">
                    18. Where applicable under law, ShowIsHere has designated a Grievance Officer to address grievances relating to its Services.
                  </p>
                  <div className="pl-4 space-y-1">
                    <p><span className="font-semibold text-slate-900">Grievance Officer:</span> Mr. H. Pathak</p>
                    <p><span className="font-semibold text-slate-900">Address:</span> Flat 13G, Tower 16, Alcove New Kolkata Sangam, 449/A/1 & 2, G.T. Road, Mahesh, Hooghly, West Bengal – 712202</p>
                    <p><span className="font-semibold text-slate-900">Phone:</span> +91 970000000</p>
                    <p><span className="font-semibold text-slate-900">Email:</span> showishereofficial@gmail.com</p>
                  </div>
                </div>

                {/* Registered Office Address */}
                <div className="pt-2">
                  <p><span className="font-semibold text-slate-900">Our registered office address:</span> 16 feet Road, Boardghar, North 24 Parganas, West Bengal 700110</p>
                </div>

                {/* Closing Agreement Acceptance Note */}
                <div className="pt-4  text-slate-900">
                  <p>
                    By accessing or using www.showishere.com (&ldquo;Website&rdquo;), you acknowledge and agree to this Privacy Policy. Your use of the Services is subject to this Privacy Policy and applicable law.
                  </p>
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

export default PrivacyPolicy;