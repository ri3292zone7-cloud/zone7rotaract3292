/* Join request email notifier — Vercel function.
   Fired by /join after a guest visit request or membership application
   is saved to Supabase. Sends a notification email to the zonal address so
   the team doesn't have to watch the dashboard.
   Requires ZONE7_SMTP_USER + ZONE7_SMTP_PASS (Gmail app password) and
   optionally ZONE7_NOTIFY_TO, set as Vercel environment variables.
   Without them it answers 501 and the form still works (DB is the source
   of truth, email is best-effort). */

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const smtpUser = process.env.ZONE7_SMTP_USER;
  const smtpPass = process.env.ZONE7_SMTP_PASS;
  const to = process.env.ZONE7_NOTIFY_TO || "ri3292zone7@gmail.com";

  if (!smtpUser || !smtpPass) {
    res.status(501).json({ ok: false, reason: "unconfigured" });
    return;
  }

  const body = req.body || {};
  const type = body.type;
  const data = body.data || {};
  if (!["guest", "application"].includes(type) || !data.fullname || !data.email) {
    res.status(400).json({ ok: false, reason: "bad payload" });
    return;
  }

  const subject = type === "guest"
    ? `Zone 7 Guest Visit Request – ${data.fullname}`
    : `Zone 7 Membership Application – ${data.fullname}`;

  const fields = {
    "Name": data.fullname,
    "Email": data.email,
    "Phone": data.phone,
    "Age": data.age,
    "Date of Birth": data.dob,
    "Blood Group": data.bloodgroup,
    "Occupation": data.occupation,
    "Institution": data.institution,
    "Preferred Club": data.preferred_club,
    "Interests": data.interests,
    "Prior Experience": data.prior_experience,
    "Referral": data.referral,
    "Message": data.message,
    "Reason to Join": data.reason,
    "Skills / Contribution": data.contribution
  };

  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0; color:#666; white-space:nowrap; vertical-align:top;"><b>${k}</b></td><td style="padding:6px 0; vertical-align:top;">${String(v).replace(/</g, "&lt;")}</td></tr>`)
    .join("");

  const html = `<div style="font-family:Arial, sans-serif; max-width:560px;">
<h2 style="color:#E1196E; margin-bottom:6px;">${type === "guest" ? "New guest visit request" : "New membership application"}</h2>
<p style="color:#666; margin:0 0 18px;">Submitted via the Zone 7 website. View and manage it in the admin dashboard (Join Requests).</p>
<table style="font-size:14px; border-collapse:collapse; width:100%;">${rows}</table>
<p style="color:#999; font-size:12px; margin-top:18px;">Sent by the Zone 7 website notifier.</p>
</div>`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass }
    });
    await transporter.sendMail({
      from: `"Zone 7 Website" <${smtpUser}>`,
      to,
      subject,
      html,
      text: Object.entries(fields).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, reason: "smtp error" });
  }
}
