import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendWelcomeMail = async (email: string, tempPassword: string) => {
    try {
        const emailHtmlContent = `
        <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif; color: #333333; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <!-- Outer Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f8; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0073e6; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">
                Fateh Campus Ambassador Program
              </h1>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="padding: 30px 25px; background-color: #ffffff;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #333333;">
                Dear <strong>Ambassador</strong>,
              </p>

              <h2 style="color: #0073e6; font-size: 20px; margin: 0 0 16px 0; font-weight: bold;">
                Welcome to Your Fateh Campus Ambassador Journey!
              </h2>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #444444;">
                Welcome to the next step of your <strong>Fateh Campus Ambassador journey</strong>. Your dedicated Ambassador Dashboard is your go-to space for activities, updates, submissions, and resources.
              </p>

              <!-- Credentials / Info Box (Left Border Highlight) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0; background-color: #f0f7fc; border-left: 4px solid #0073e6; border-radius: 0 8px 8px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px 0; color: #0073e6; font-size: 16px; font-weight: bold;">
                      Your Ambassador Dashboard Credentials
                    </h3>
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #333333; line-height: 1.5;">
                      <strong>Dashboard:</strong> Fateh Campus Ambassador Dashboard
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #333333; line-height: 1.5;">
                      <strong>Mail ID:</strong> Your registered mail ID
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.5;">
                      <strong>Temporary Access Key:</strong> <code style="background-color: #e2f0fd; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #0073e6; font-weight: bold;">${tempPassword}</code>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #444444;">
                Use the temporary access key above to log in and create your permanent password.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #444444;">
                Explore your dashboard, take on campus activities, and start making an impact!
              </p>

              <!-- Support Note Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0; background-color: #f0f7fc; border-left: 4px solid #0073e6; border-radius: 0 8px 8px 0;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 6px 0; color: #0073e6; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                      NEED HELP?
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #444444; line-height: 1.5;">
                      In case you face any technical issues or are unable to log in to the dashboard, please connect with the central team at <strong>HYPEDIN</strong>:
                      <br />
                      <strong>Soumya:</strong> <a href="tel:9667769659" style="color: #0073e6; text-decoration: none; font-weight: bold;">9667769659</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 8px 0; font-size: 15px; font-weight: bold; color: #0073e6;">
                Let’s get started!
              </p>
            </td>
          </tr>

          <!-- Footer Banner -->
          <tr>
            <td style="background-color: #0073e6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #ffffff; margin: 0 0 4px 0; font-size: 13px;">
                Regards,
              </p>
              <p style="color: #ffffff; margin: 0; font-size: 15px; font-weight: bold;">
                Team Fateh Campus Ambassador
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
        `

        const options = {
            from: 'Fateh Campus Ambassador Program <soumya@hypedin.co>',
            replyTo: "soumya@hypedin.co",
            to: "soumya@hypedin.co",
            bcc: email,
            subject: "Fateh Campus Ambassador Program | Month 1 SOP & Task Guide",
            text: "Fateh Campus Ambassador Program | Month 1 SOP & Task Guide",
            html: emailHtmlContent,
            headers: {
                'X-Entity-Ref-ID': Date.now().toString(),
            }
        }

        await transporter.sendMail(options);
        console.log("Mail sent successfully");
    } catch(error: unknown) {
        console.log(error);

        return;
    }
}

export { sendWelcomeMail }