import nodemailer from 'nodemailer';

// ─── Transporter ──────────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ─── Email Template ───────────────────────────────────────────────────────────
const buildConfirmationHtml = ({ patientName, selectedService, appointmentDate, appointmentTime, doctor, clinicName }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment Confirmation</title>
  <style>
    body { margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #111111; padding: 36px 40px; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.3px; }
    .header p { color: rgba(255,255,255,0.55); font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1.5px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 16px; color: #222; font-weight: 600; margin-bottom: 8px; }
    .subtext { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 28px; }
    .card { background: #f8f8f8; border-radius: 12px; padding: 24px; margin-bottom: 28px; }
    .card-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px; color: #aaa; margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #ebebeb; }
    .row:last-child { border-bottom: none; }
    .row-label { font-size: 12px; color: #888; font-weight: 500; }
    .row-value { font-size: 13px; color: #111; font-weight: 700; }
    .badge { display: inline-block; background: #111; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 28px; }
    .cta { background: #111; color: #fff; text-align: center; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: 700; text-decoration: none; display: inline-block; }
    .footer { padding: 24px 40px; border-top: 1px solid #f0f0f0; text-align: center; }
    .footer p { font-size: 11px; color: #bbb; margin: 0; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${clinicName}</h1>
      <p>Quality Healthcare</p>
    </div>
    <div class="body">
      <p class="greeting">Hello, ${patientName}! 👋</p>
      <p class="subtext">
        Your appointment has been successfully booked. We look forward to seeing you!
        Our team will contact you to confirm any additional details.
      </p>
      <span class="badge">✓ Confirmed</span>
      <div class="card">
        <p class="card-title">Booking Details</p>
        <div class="row">
          <span class="row-label">Service</span>
          <span class="row-value">${selectedService}</span>
        </div>
        <!--
        <div class="row">
          <span class="row-label">Doctor</span>
          <span class="row-value">${doctor}</span>
        </div>
        -->
        <div class="row">
          <span class="row-label">Date</span>
          <span class="row-value">${appointmentDate}</span>
        </div>
        <div class="row">
          <span class="row-label">Time</span>
          <span class="row-value">${appointmentTime}</span>
        </div>
      </div>
      <p style="font-size:13px;color:#666;line-height:1.7;margin-bottom:28px;">
        Need to reschedule or have any questions? Contact us anytime.
      </p>
    </div>
    <div class="footer">
      <p>${clinicName} · Suryakiran, Sector 5, Ghansoli, Navi Mumbai 400701</p>
      <p>+91 22 2778 0190 · ghansoli@dentalhealth.com</p>
    </div>
  </div>
</body>
</html>
`;

// ─── Send Confirmation Email ──────────────────────────────────────────────────
/**
 * Sends a booking confirmation email. Errors are handled gracefully —
 * a failure here will NOT crash the server or reject the booking response.
 */
export const sendConfirmationEmail = async (appointment) => {
  const clinicName = process.env.CLINIC_NAME || 'Dental Health';

  try {
    const transporter = createTransporter();

    // Verify connection configuration (optional — skip in prod if slow)
    await transporter.verify();

    const formattedDate = new Date(appointment.appointmentDate + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"${clinicName}" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      subject: `✓ Appointment Confirmed – ${clinicName}`,
      html: buildConfirmationHtml({
        patientName: appointment.patientName,
        selectedService: appointment.selectedService,
        appointmentDate: formattedDate,
        appointmentTime: appointment.appointmentTime,
        doctor: appointment.doctor,
        clinicName,
      }),
    });

    console.log(`  ✉  Confirmation email sent → ${appointment.email}`);
  } catch (err) {
    // Log but do NOT re-throw — the booking already succeeded
    console.warn(`  ⚠  Email send failed (non-critical): ${err.message}`);
  }
};
