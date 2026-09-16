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