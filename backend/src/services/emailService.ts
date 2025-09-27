import nodemailer from "nodemailer";
import { Patient } from "../types";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendConfirmationEmail = async (
  patient: Patient
): Promise<void> => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "noreply@patientapp.com",
    to: patient.email,
    subject: "Patient Registration Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Registration Confirmed!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to our patient registration system</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Dear <strong>${
            patient.fullname
          }</strong>,</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Your patient registration has been successfully completed. We're excited to have you as part of our healthcare system.
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">Registration Details</h3>
            <div style="display: grid; gap: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="color: #666; font-weight: 500;">Name:</span>
                <span style="color: #333; font-weight: 600;">${
                  patient.fullname
                }</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="color: #666; font-weight: 500;">Email:</span>
                <span style="color: #333; font-weight: 600;">${
                  patient.email
                }</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="color: #666; font-weight: 500;">Phone:</span>
                <span style="color: #333; font-weight: 600;">${
                  patient.countrycode
                } ${patient.phone}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #666; font-weight: 500;">Registration Date:</span>
                <span style="color: #333; font-weight: 600;">${new Date(
                  patient.createdat
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #333; font-weight: 600; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #666; margin: 0;">The Patient Registration Team</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${patient.email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
