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