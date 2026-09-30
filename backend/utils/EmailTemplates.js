exports.getOtpEmailTemplate = (otp) => ({
  subject: "showishere - OTP for email verification",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0E3652; line-height: 1.6;">
      <p><b>Dear User,</b></p>
      <p>Your One-Time Password (OTP) is <b>${otp}</b> &amp; it is valid for 10 minutes on showishere portal.</p>
      <p>For additional support, kindly reach out to the helpline e-mail provided on the showishere website.</p>
      <br/>
      <p><b>Thanks &amp; Best regards</b><br/>Team showishere</p>
      <br/><hr style="border: none; border-top: 1px solid #e2e8f0;"/><p style="font-size: 11px; color: #64748b;">This is a system-generated email. Please do not reply to this mail.</p>
    </div>
  `
});
 
exports.getKycUnderProcessEmailTemplate = (userName = 'User') => ({
  subject: "ShowIsHere - Agreement Submitted & KYC Under Process",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0E3652; line-height: 1.6;">
      <p><b>Dear ${userName},</b></p>
      <p>Thank you for submitting your agreement and document details on <b>ShowIsHere</b>.</p>
      <p>Your signed agreement and KYC documents are currently <b>under process and review</b> by our verification team. We are carefully checking your submission, and once approved, your account will be fully activated for event management.</p>
      <p>You will receive a confirmation email as soon as your KYC verification is complete.</p>
      <p>For any questions or additional support, kindly reach out to the helpline email provided on the ShowIsHere website.</p>
      <br/>
      <p><b>Thanks &amp; Best Regards</b><br/>Team ShowIsHere</p>
      <br/><hr style="border: none; border-top: 1px solid #e2e8f0;"/><p style="font-size: 11px; color: #64748b;">This is a system-generated email. Please do not reply to this mail.</p>
    </div>
  `
});


exports.getEventCancellationSubmittedEmailTemplate = (userName = 'User', requestId = '') => ({
  subject: "ShowIsHere - Event Cancellation Request Submitted",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0E3652; line-height: 1.6;">
      <p><b>Dear ${userName},</b></p>
      <p>Your cancellation request has been submitted.</p>
      <p>Your request is currently under review. We’ll notify you once the request has been reviewed and a decision has been made.</p>
      <p><b>Request ID:</b> ${requestId}</p>
      <br/>
      <p><b>Thanks &amp; Best Regards</b><br/>Team ShowIsHere</p>
      <br/><hr style="border: none; border-top: 1px solid #e2e8f0;"/><p style="font-size: 11px; color: #64748b;">This is a system-generated email. Please do not reply to this mail.</p>
    </div>
  `
});


exports.getEventCancellationAcceptedEmailTemplate = (userName = 'User', eventName = '', requestId = '') => ({
  subject: "ShowIsHere - Event Cancellation Request Accepted",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0E3652; line-height: 1.6;">
      <p><b>Dear ${userName},</b></p>
      <p>Your cancellation request for the event <b>${eventName}</b> has been <b>accepted</b>.</p>
      <p>The event status has now been updated to <b>CANCELED</b> on the platform.</p>
      <p><b>Request ID:</b> ${requestId}</p>
      <br/>
      <p><b>Thanks &amp; Best Regards</b><br/>Team ShowIsHere</p>
      <br/><hr style="border: none; border-top: 1px solid #e2e8f0;"/><p style="font-size: 11px; color: #64748b;">This is a system-generated email. Please do not reply to this mail.</p>
    </div>
  `
});

exports.getEventCancellationRejectedEmailTemplate = (userName = 'User', eventName = '', requestId = '') => ({
  subject: "ShowIsHere - Event Cancellation Request Rejected",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0E3652; line-height: 1.6;">
      <p><b>Dear ${userName},</b></p>
      <p>Your cancellation request for the event <b>${eventName}</b> has been <b>rejected</b> by the admin.</p>
      <p>Your event remains active on the platform.</p>
      <p><b>Request ID:</b> ${requestId}</p>
      <br/>
      <p><b>Thanks &amp; Best Regards</b><br/>Team ShowIsHere</p>
      <br/><hr style="border: none; border-top: 1px solid #e2e8f0;"/><p style="font-size: 11px; color: #64748b;">This is a system-generated email. Please do not reply to this mail.</p>
    </div>
  `
});