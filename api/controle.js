// Contrôle mensuel du formulaire, déclenché par la tâche planifiée Vercel (vercel.json → crons).
// 1. Interroge Brevo pour garder la clé API active (elle expire après 90 jours sans utilisation).
// 2. Envoie un court e-mail « tout fonctionne » à contact@horizonfenetre.com.
// Seul l'appel de Vercel est accepté : en-tête Authorization = CRON_SECRET si cette variable existe,
// sinon l'agent « vercel-cron ». Aucune donnée personnelle n'est traitée.

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.authorization || "";
  const parVercel = secret ? auth === `Bearer ${secret}` : String(req.headers["user-agent"] || "").startsWith("vercel-cron");
  if (!parVercel) { res.statusCode = 401; return res.end("Non autorisé"); }

  const cle = process.env.BREVO_API_KEY;
  if (!cle) { console.error("controle: BREVO_API_KEY absente"); res.statusCode = 500; return res.end("Clé absente"); }
  const vers = process.env.CONTACT_TO || "contact@horizonfenetre.com";
  const de = process.env.CONTACT_FROM || "contact@horizonfenetre.com";
  const entetes = { "api-key": cle, "content-type": "application/json", accept: "application/json" };

  try {
    const compte = await fetch("https://api.brevo.com/v3/account", { headers: entetes });
    if (!compte.ok) throw new Error(`compte ${compte.status}`);
    const date = new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });
    const texte = `Contrôle automatique du ${date} : le formulaire de devis de www.horizonfenetre.com fonctionne et la clé Brevo est active.\n\nAucune action à faire. Ce message arrive une fois par mois.`;
    const envoi = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: entetes,
      body: JSON.stringify({
        sender: { name: "Site Horizon Fenêtre", email: de },
        to: [{ email: vers }],
        subject: "Contrôle mensuel : formulaire du site OK",
        textContent: texte,
        htmlContent: `<p style="font-family:Arial,sans-serif;font-size:14px">${texte.replace(/\n/g, "<br>")}</p>`,
      }),
    });
    if (!envoi.ok) throw new Error(`envoi ${envoi.status}`);
  } catch (e) {
    console.error("controle: échec", e.message);
    res.statusCode = 502; return res.end("Échec");
  }
  res.statusCode = 200; res.end("OK");
}
