import React from 'react';
import {
  gstDeclarationContainer,
  gstDeclarationList
} from '../styles/MasterCSSClass';

const GSTDeclaration = ({ 
  platformName = "Emunity Solutions Pvt. Ltd.", 
  platformDomain = "www.showishere.com", 
  thresholdAmount = "₹20 Lakhs" 
}) => {
  return (
    <div className={gstDeclarationContainer}>
      <p>
        I/We, the Organizer, hereby declare, confirm, and acknowledge that I/We are engaged in providing services through an e-commerce platform and fall within the scope of Section 24(ix) of the Central Goods and Services Tax Act, as applicable under the prevailing GST regime ("GST Laws").
      </p>
      <p>
        I/We further declare that I/We are not registered under the GST Act, as our annual turnover from the supply of services is below the applicable GST registration threshold of {thresholdAmount}.
      </p>
      <p>
        I/We acknowledge and agree that any taxes, duties, levies, or other statutory liabilities, if applicable, in relation to tickets booked through {platformName}, including through its platform {platformDomain}, mobile application, or any other sales channel, shall be solely our responsibility and the same shall be duly discharged by us.
      </p>
      <p>
        I/We hereby confirm that all information and declarations provided by me/us are true, complete, and accurate to the best of my/our knowledge and belief. I/We agree that this declaration shall also be binding upon my/our duly constituted attorney or authorized representative.
      </p>
      <p>
        If any information or representation provided herein is subsequently found to be false at a later date, inaccurate, incomplete, or misleading, {platformName} shall be entitled, subject to applicable laws, to cancel or suspend my/our membership and/or event listing and to withhold any pending payments.
      </p>
      <p>
        I/We hereby request {platformName} to list and promote our event on its platform and agree to indemnify, defend, and hold harmless {platformName}, its officers, representatives, affiliates, successors, and assigns from and against any costs, penalties, losses, damages, claims, liabilities, or expenses arising out of or in connection with:
      </p>
      <ol className={gstDeclarationList}>
        <li>Any breach, violation, or non-compliance with the terms of this declaration.</li>
        <li>Any act, omission, or circumstance resulting in any information, statement, or representation provided by me/us becoming false, incorrect, or misleading.</li>
        <li>Violation or alleged violation of applicable laws, including GST laws.</li>
        <li>Any failure to comply with applicable GST registration, reporting, payment, or other statutory obligations.</li>
        <li>Any investigation, inquiry, notice, summons, inspection, assessment, proceeding, or action initiated or conducted by any governmental, regulatory, tax, or other competent authority in relation to the foregoing.</li>
      </ol>
      <p>
        I/We further undertake to promptly notify {platformName} in writing of any change in the constitution or operations of my/our business entity that may affect the accuracy or validity of the information and declarations provided herein.
      </p>
    </div>
  );
};

export default GSTDeclaration;