/* Join request email notifier - Vercel function.
   Fired by /join after a guest visit request or membership application
   is saved to Supabase. Sends three kinds of email.

   1. A notification to the zonal address so the team does not have to
      watch the dashboard. Full applicant details.
   2. A humanized note with full applicant details to the club the person
      chose, so that club can follow up while the interest is warm.
   3. An anonymous promotional note to every other club. No personal
      details at all. It simply says a new member arrived in Zone 7 and
      went to the chosen club, and nudges the club to promote itself.

   Club mail goes to the club primary address and every alternate address
   on file, so no club inbox misses it.

   Requires ZONE7_SMTP_USER + ZONE7_SMTP_PASS (Gmail app password) and
   optionally ZONE7_NOTIFY_TO, set as Vercel environment variables.
   Without them it answers 501 and the form still works (the DB is the
   source of truth, email is best-effort). */

import nodemailer from "nodemailer";

const CLUB_EMAILS = {
  "Rotaract Club of Balkumari": {
    primary: "balkumari@rotaract3292.org",
    alternates: ["rotaractclubofbalkumari@gmail.com"]
  },
  "Rotaract Club of Baneshwor": {
    primary: "baneshwor@rotaract3292.org",
    alternates: ["rcbaneshwor@gmail.com"]
  },
  "Rotaract Club of Liberty College": {
    primary: "libertycollege@rotaract3292.org",
    alternates: ["raclibertycollege123@gmail.com"]
  },
  "Rotaract Club of Kathmandu West": {
    primary: "kathmanduwest@rotaract3292.org",
    alternates: []
  },
  "Rotaract Club of Kathmandu Height": {
    primary: "kathmanduheight@rotaract3292.org",
    alternates: []
  },
  "Rotaract Club of Sankhu": {
    primary: "sankhu@rotaract3292.org",
    alternates: ["Rotaractclubofsankhu@gmail.com"]
  },
  "Rotaract Club of New Road City Kathmandu": {
    primary: "NewRoadCityKathmandu@rotaract3292.org",
    alternates: ["racnewroadcitykathmandu@gmail.com"]
  },
  "Rotaract Club of Sukedhara": {
    primary: "sukedhara@rotaract3292.org",
    alternates: ["s.sukedhara@rotaract3292.org"]
  },
  "Rotaract Club of Tripureswor": {
    primary: "tripureshwor@rotaract3292.org",
    alternates: []
  }
};

const FIELD_LABELS = {
  fullname: "Name",
  email: "Email",
  phone: "Phone",
  age: "Age",
  dob: "Date of Birth",
  bloodgroup: "Blood Group",
  occupation: "Occupation",
  institution: "Institution",
  preferred_club: "Preferred Club",
  interests: "Interests",
  prior_experience: "Prior Experience",
  referral: "Referral",
  message: "Message",
  reason: "Reason to Join",
  contribution: "Skills / Contribution"
};

function pickFields(data) {
  return Object.entries(FIELD_LABELS)
    .map(([key, label]) => [label, data[key]])
    .filter(([, v]) => v !== undefined && v !== null && v !== "");
}

function findClub(preferred) {
  if (!preferred) return null;
  const want = String(preferred).trim().toLowerCase();
  for (const name of Object.keys(CLUB_EMAILS)) {
    if (name.toLowerCase() === want) return { name, ...CLUB_EMAILS[name] };
  }
  return null;
}

function detailsHtml(pairs) {
  return pairs
    .map(([k, v]) =>
      `<tr><td style="padding:6px 12px 6px 0; color:#666; white-space:nowrap; vertical-align:top;"><b>${k}</b></td>` +
      `<td style="padding:6px 0; vertical-align:top;">${String(v).replace(/</g, "&lt;")}</td></tr>`
    )
    .join("");
}

function detailsText(pairs) {
  return pairs.map(([k, v]) => `${k}: ${v}`).join("\n");
}

function buildTransporter(smtpUser, smtpPass) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass }
  });
}

async function sendZone7Mail(transporter, smtpUser, type, data, pairs, subject) {
  const kind = type === "guest" ? "New guest visit request" : "New membership application";
  const html = `<div style="font-family:Arial, sans-serif; max-width:560px;">
<h2 style="color:#E1196E; margin-bottom:6px;">${kind}</h2>
<p style="color:#666; margin:0 0 18px;">Someone submitted a form on the Zone 7 website. Manage it in the admin dashboard under Join Requests.</p>
<table style="font-size:14px; border-collapse:collapse; width:100%;">${detailsHtml(pairs)}</table>
<p style="color:#999; font-size:12px; margin-top:18px;">Sent by the Zone 7 website notifier.</p>
</div>`;
  await transporter.sendMail({
    from: `"Zone 7 Website" <${smtpUser}>`,
    to: process.env.ZONE7_NOTIFY_TO || "ri3292zone7@gmail.com",
    subject,
    html,
    text: detailsText(pairs)
  });
}

async function sendFullDetailsMail(transporter, smtpUser, club, type, data, pairs) {
  const firstName = (data.fullname || "").trim().split(/\s+/)[0] || "someone";
  const kind = type === "guest"
    ? "asked for a guest visit"
    : "sent in a membership application";

  const text = [
    `Hi ${club.name} team,`,
    "",
    `Something lovely just happened. Someone walked into the Zone 7 website and ${kind}.`,
    "",
    `A new member has arrived in Zone 7 and they went to ${club.name}. Really. That is how clubs grow, one quiet step at a time.`,
    "",
    `Here is what we know about ${firstName}.`,
    "",
    ...detailsText(pairs).split("\n"),
    "",
    `Reach out soon. The interest is still warm and a simple hello can change everything. Invite them to a meeting, answer their questions, and let the club do the rest.`,
    `And while you are at it, do a little promoting. Share your meeting time, post about a recent project, and remind people why ${club.name} is worth joining. You never know who is reading.`,
    "",
    "The Zone 7 team"
  ].join("\n");

  const html = `<div style="font-family:Arial, sans-serif; max-width:560px;">
<h2 style="color:#E1196E; margin:0 0 10px;">Someone wants to join ${club.name}</h2>
<p style="color:#666; margin:0 0 16px;">Something lovely just happened. A new member has arrived in Zone 7 and they went to ${club.name}. Really.</p>
<table style="font-size:14px; border-collapse:collapse; width:100%;">${detailsHtml(pairs)}</table>
<p style="margin:18px 0 4px;">Reach out soon. The interest is still warm and a simple hello can change everything. Invite them to a meeting, answer their questions, and let the club do the rest.</p>
<p style="margin:0;">And while you are at it, do a little promoting. Share your meeting time, post about a recent project, and remind people why ${club.name} is worth joining. You never know who is reading.</p>
<p style="color:#999; font-size:12px; margin-top:18px;">The Zone 7 team</p>
</div>`;

  await transporter.sendMail({
    from: `"Zone 7 Website" <${smtpUser}>`,
    to: club.primary,
    bcc: club.alternates,
    subject: `A new member chose ${club.name}`,
    html,
    text
  });
}

async function sendAnonymousPromoMail(transporter, smtpUser, club, chosenClubName) {
  const text = [
    `Hi ${club.name} team,`,
    "",
    `Something good just happened in the zone. A new member has arrived in Zone 7 and they went to ${chosenClubName}.`,
    "",
    `That could have been you. And next time, it might be.`,
    "",
    `So use this as a gentle push to promote ${club.name} this week. Post your meeting time. Share a story from a recent project. Tell people what makes your club worth joining. A few minutes of noise can bring a whole new face.`,
    "",
    "Here are a few ideas that actually work.",
    "",
    "1. Invite people to a real meeting. A personal ask from a member beats any poster.",
    "2. Show your projects on Instagram. People join clubs they can see and feel.",
    "3. Talk to friends and classmates one on one. Warm conversations convert best.",
    "4. Celebrate every new member out loud. Clubs that feel welcoming keep growing.",
    "",
    "Give it a try. You might be surprised who turns up.",
    "",
    "The Zone 7 team"
  ].join("\n");

  const html = `<div style="background:#FFF8EF; padding:24px 12px; font-family:Arial, Helvetica, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
  <tr>
    <td style="background:#1B1836; padding:24px 28px; border-radius:14px 14px 0 0;">
      <div style="color:#F2A900; font-size:12px; letter-spacing:2px; font-weight:700;">ZONE 7 | ROTARACT DISTRICT 3292</div>
      <div style="color:#FFF8EF; font-size:23px; font-weight:800; margin-top:8px; line-height:1.3;">A new member has arrived in Zone 7</div>
    </td>
  </tr>
  <tr>
    <td style="background:#FFFFFF; padding:28px; border-left:1px solid #F0E8DB; border-right:1px solid #F0E8DB;">
      <p style="margin:0 0 14px; color:#1B1836; font-size:15px; line-height:1.65;">They went to <b style="color:#E1196E;">${chosenClubName}</b>. A new member has arrived in Zone 7 and that is where they chose to go. That could have been you. Next time, it might be.</p>
      <p style="margin:0 0 22px; color:#555; font-size:14px; line-height:1.65;">So use this as a gentle push. Promote ${club.name} this week and see who turns up.</p>
      <div style="background:#FFF8EF; border-left:4px solid #E1196E; padding:16px 18px; border-radius:0 10px 10px 0; margin-bottom:24px;">
        <div style="color:#A80F52; font-weight:700; font-size:12px; letter-spacing:1px; margin-bottom:10px;">HOW TO FIND YOUR NEXT MEMBER</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="top" style="width:28px; color:#E1196E; font-size:17px; font-weight:800; padding:0 6px 0 0;">1</td>
            <td style="padding-bottom:12px; color:#1B1836; font-size:14px; line-height:1.55;">Invite people to a real meeting. A personal ask from a member beats any poster.</td>
          </tr>
          <tr>
            <td valign="top" style="width:28px; color:#E1196E; font-size:17px; font-weight:800; padding:0 6px 0 0;">2</td>
            <td style="padding-bottom:12px; color:#1B1836; font-size:14px; line-height:1.55;">Show your projects on Instagram. People join clubs they can see and feel.</td>
          </tr>
          <tr>
            <td valign="top" style="width:28px; color:#E1196E; font-size:17px; font-weight:800; padding:0 6px 0 0;">3</td>
            <td style="padding-bottom:12px; color:#1B1836; font-size:14px; line-height:1.55;">Talk to friends and classmates one on one. Warm conversations convert best.</td>
          </tr>
          <tr>
            <td valign="top" style="width:28px; color:#E1196E; font-size:17px; font-weight:800; padding:0 6px 0 0;">4</td>
            <td style="color:#1B1836; font-size:14px; line-height:1.55;">Celebrate every new member out loud. Clubs that feel welcoming keep growing.</td>
          </tr>
        </table>
      </div>
      <p style="margin:0 0 6px; color:#1B1836; font-size:15px; line-height:1.65;">Make some noise for ${club.name} this week. Post your meeting time, share a story from a recent project, and tell people what makes your club worth joining.</p>
      <p style="margin:0; color:#1B1836; font-size:15px; line-height:1.65;">A few minutes of noise can bring a whole new face. Give it a try and you might be surprised who turns up.</p>
    </td>
  </tr>
  <tr>
    <td style="background:#1B1836; padding:18px 28px; border-radius:0 0 14px 14px;">
      <div style="color:#B9B3C9; font-size:12px; line-height:1.5;">Sent by the Zone 7 website notifier | Rotaract District 3292 Nepal-Bhutan</div>
    </td>
  </tr>
</table>
</div>`;

  await transporter.sendMail({
    from: `"Zone 7 Website" <${smtpUser}>`,
    to: club.primary,
    bcc: club.alternates,
    subject: "A new member has arrived in Zone 7",
    html,
    text
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const smtpUser = process.env.ZONE7_SMTP_USER;
  const smtpPass = process.env.ZONE7_SMTP_PASS;

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

  const pairs = pickFields(data);
  const chosen = findClub(data.preferred_club);
  const subject = type === "guest"
    ? `Zone 7 Guest Visit Request from ${data.fullname}`
    : `Zone 7 Membership Application from ${data.fullname}`;

  const transporter = buildTransporter(smtpUser, smtpPass);
  const jobs = [];

  if (chosen) {
    jobs.push({
      id: "club:" + chosen.name,
      run: () => sendFullDetailsMail(transporter, smtpUser, chosen, type, data, pairs)
    });
    for (const name of Object.keys(CLUB_EMAILS)) {
      if (name === chosen.name) continue;
      jobs.push({
        id: "promo:" + name,
        run: () => sendAnonymousPromoMail(transporter, smtpUser, { name, ...CLUB_EMAILS[name] }, chosen.name)
      });
    }
  }

  jobs.push({
    id: "zone7",
    run: () => sendZone7Mail(transporter, smtpUser, type, data, pairs, subject)
  });

  const results = await Promise.allSettled(jobs.map((j) => j.run()));
  const sent = results.map((r, i) => (r.status === "fulfilled" ? jobs[i].id : null)).filter(Boolean);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error("mail failed: " + jobs[i].id, r.reason);
  });

  if (sent.length === 0) {
    res.status(500).json({ ok: false, reason: "smtp error" });
    return;
  }

  res.json({ ok: true, sent });
}
