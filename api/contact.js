// Réception du formulaire de contact — fonction Vercel exécutée à Paris (cdg1).
// Envoi par l'API transactionnelle de Brevo (prestataire français, données hébergées dans l'UE).
// Aucune donnée personnelle n'est stockée ni journalisée par cette fonction.
// Variables d'environnement Vercel : BREVO_API_KEY (obligatoire),
// CONTACT_TO (destinataire, par défaut contact@horizonfenetre.com), CONTACT_FROM (expéditeur vérifié dans Brevo).

const CHAMPS = { nom: 120, telephone: 30, email: 160, produit: 80, message: 3000, origine: 20 };
const OBLIGATOIRES = ["nom", "telephone", "email"];

const aller = (res, chemin) => { res.statusCode = 303; res.setHeader("Location", chemin); res.setHeader("Cache-Control", "no-store"); res.end(); };
const propre = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const html = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function lireCorps(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const morceaux = [];
  for await (const m of req) morceaux.push(m);
  const brut = Buffer.concat(morceaux).toString("utf8").slice(0, 20000);
  return Object.fromEntries(new URLSearchParams(brut));
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.statusCode = 405; res.setHeader("Allow", "POST"); return res.end(); }
  let corps;
  try { corps = await lireCorps(req); } catch { return aller(res, "/erreur-envoi/"); }

  // Pot de miel anti-robots : un humain ne voit pas ce champ.
  if (propre(corps.site_web, 200)) return aller(res, "/merci/");

  const d = Object.fromEntries(Object.entries(CHAMPS).map(([k, max]) => [k, propre(corps[k], max)]));
  if (OBLIGATOIRES.some((k) => !d[k]) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return aller(res, "/erreur-envoi/");

  const cle = process.env.BREVO_API_KEY;
  if (!cle) { console.error("contact: BREVO_API_KEY absente"); return aller(res, "/erreur-envoi/"); }
  const vers = process.env.CONTACT_TO || "contact@horizonfenetre.com";
  const de = process.env.CONTACT_FROM || "contact@horizonfenetre.com";

  const lignes = [
    ["Nom", d.nom], ["Téléphone", d.telephone], ["E-mail", d.email], ["Produit", d.produit],
    ["Formulaire", d.origine], ["Message", d.message || "(aucun)"],
  ];
  const texte = lignes.map(([k, v]) => `${k} : ${v}`).join("\n");
  const htmlContent = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${lignes.map(([k, v]) => `<tr><th align="left" style="background:#e9f6fb;color:#33454d">${html(k)}</th><td>${html(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>`;

  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": cle, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Site Horizon Fenêtre", email: de },
        to: [{ email: vers }],
        replyTo: { email: d.email, name: d.nom },
        subject: `Demande de devis : ${d.produit || "projet"} – ${d.nom}`,
        textContent: texte,
        htmlContent,
      }),
    });
    if (!r.ok) { console.error("contact: échec Brevo", r.status); return aller(res, "/erreur-envoi/"); }
  } catch {
    console.error("contact: Brevo injoignable");
    return aller(res, "/erreur-envoi/");
  }
  return aller(res, "/merci/");
}
