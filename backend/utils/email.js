import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetCode, firstName) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetCode}`;

  const mailOptions = {
    from: {
      name: "CodingKaro",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: "Reset Your CodingKaro Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">CodingKaro</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">Hi ${
            firstName || "there"
          },</p>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            You requested to reset your password for your CodingKaro account. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);">
              Reset My Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; color: #4F46E5; background-color: #f8f9ff; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 13px;">
            ${resetUrl}
          </p>
          
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 25px 0;">
            <p style="color: #dc2626; margin: 0; font-weight: bold;">⏰ Important:</p>
            <p style="color: #dc2626; margin: 5px 0 0 0; font-size: 14px;">This link will expire in 15 minutes for security reasons.</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            If you didn't request this password reset, please ignore this email and your account will remain secure.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <div style="text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              Best regards,<br>
              <strong>CodingKaro Team</strong>
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Detailed email error:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });

    if (error.code === "EAUTH") {
      throw new Error(
        "Email authentication failed. Please check your Gmail App Password."
      );
    } else if (error.code === "ECONNECTION") {
      throw new Error(
        "Failed to connect to Gmail. This might be a firewall or network issue."
      );
    } else if (error.responseCode === 535) {
      throw new Error(
        "Invalid email credentials. Please verify your Gmail App Password."
      );
    } else {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
};
