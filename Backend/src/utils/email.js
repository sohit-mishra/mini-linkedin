const nodemailer = require("nodemailer");
const env = require("@/config/env");

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  auth: {
    user: env.EMAIL_USER, 
    pass: env.EMAIL_PASS, 
  },
});

const sendEmailOTP = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: `"${env.APP_NAME || "Our Service"}" <${env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Verify Your Account - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:auto; padding:20px; border:1px solid #eaeaea; border-radius:8px;">
          <h2 style="color:#333;">Verify Your Account</h2>
          <p>Hello ${name || "User"},</p>
          <p>Thank you for registering with <strong>${env.APP_NAME || "Our Service"}</strong>. 
          To complete your registration and activate your account, please verify your email address.</p>
          
          <p style="margin-top:20px; font-size:16px;">
            <strong>Your One-Time Password (OTP):</strong>
          </p>
          <div style="font-size:24px; font-weight:bold; letter-spacing:4px; color:#2c3e50; margin:10px 0;">
            ${otp}
          </div>

          <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          
          <p>If you did not request this, please ignore this email. Someone may have entered your email address by mistake.</p>
          
          <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;">
          <p style="font-size:12px; color:#777;">
            This is an automated message from ${env.APP_NAME || "Our Service"}. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("error", error.message || "Failed to send OTP email");
  }
};


const sendAccountSuccessEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"${env.APP_NAME}" <${env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Account Created Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:auto; padding:20px; border:1px solid #eaeaea; border-radius:8px;">
          <h2 style="color:#28a745;">Welcome, ${name}!</h2>
          <p>Your account with <strong>${env.APP_NAME}</strong> has been created successfully.</p>
          <p>You can now log in and enjoy our services.</p>
          <p>Thank you for joining us 🚀</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("error", error.message);
  }
};

const sendForgotPasswordEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: `"${env.APP_NAME}" <${env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:auto; padding:20px; border:1px solid #eaeaea; border-radius:8px;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for <strong>${env.APP_NAME}</strong>.</p>
          <p>Click the link below to set a new password:</p>
          <a href="${resetLink}" style="display:inline-block; padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:4px;">
            Reset Password
          </a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("error", error.message);
  }
};

module.exports = { sendEmailOTP , sendAccountSuccessEmail , sendForgotPasswordEmail  };
