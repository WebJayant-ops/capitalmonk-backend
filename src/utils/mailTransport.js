import nodemailer from "nodemailer";

// export const mailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "mavadiyadivyesh56@gmail.com",
//     pass: "xlsz gkwd rrtg qhip",
//     // pass:"gujv nmsy zsnx yusj"
//   },
// });

export const mailTransporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Replace with the SMTP host for Capitalmonks
  port: 465, // Use 465 for SSL, 587 for TLS (secure: false)
  secure: true, // True for SSL, false for TLS or non-secure
  auth: {
    user: "info@Capitalmonks.com", // Your custom email
    pass: "Tradecapital@2024", // Email account password
  },
});
