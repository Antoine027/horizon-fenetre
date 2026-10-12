// Générateur statique du site Horizon Fenêtre — aucune dépendance.
// node build.mjs  → dossier dist/
import fs from "node:fs";
import path from "node:path";
import { produits, pros } from "./src/produits.mjs";
import { dessins, ville } from "./src/dessins.mjs";

const SITE = "https://horizonfenetre.com";
const OUT = "dist";
const TEL = "04 28 55 00 24";
const TEL_LIEN = "+33428550024";
const MAIL = "contact@horizonfenetre.com";
const ADRESSE = { rue: "8 avenue Général Leclerc", cp: "69140", ville: "Rillieux-la-Pape" };
const COMMUNES = ["Lyon", "Rillieux-la-Pape", "Caluire-et-Cuire", "Villeurbanne", "Vaulx-en-Velin", "Bron", "Décines-Charpieu", "Meyzieu", "Sathonay-Camp", "Sathonay-Village", "Fontaines-sur-Saône", "Neuville-sur-Saône", "Fontaines-Saint-Martin", "Cailloux-sur-Fontaines", "Miribel", "Neyron", "Beynost", "Saint-Maurice-de-Beynost", "Montluel", "Dagneux", "La Boisse", "Genay", "Montanay", "Saint-Priest", "Chassieu", "Jonage", "Écully", "Tassin-la-Demi-Lune"];

const css = fs.readFileSync("src/style.css", "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
const icoTel = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>`;
const dateFr = (d) => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const ENTREPRISE = {
  "@type": "HomeAndConstructionBusiness",
  "@id": SITE + "/#entreprise",
  name: "Horizon Fenêtre",
  legalName: "ESCOM HABITAT",
  description: "Menuiserie sur mesure : fenêtres PVC, aluminium et bois, volets roulants et battants, portes de garage, portes d'entrée, portails, clôtures et moustiquaires. Fourniture et pose pour particuliers et professionnels.",
  url: SITE + "/",
  telephone: TEL_LIEN,
  email: MAIL,
  logo: SITE + "/assets/img/icon-512.png",
  image: SITE + "/assets/img/og-horizon-fenetre.jpg",
  address: { "@type": "PostalAddress", streetAddress: ADRESSE.rue, postalCode: ADRESSE.cp, addressLocality: ADRESSE.ville, addressRegion: "Auvergne-Rhône-Alpes", addressCountry: "FR" },
  geo: { "@type": "GeoCoordinates", latitude: 45.8136, longitude: 4.8977 },
  areaServed: COMMUNES.map((c) => ({ "@type": "City", name: c })),
  vatID: "FR70106406465",
  taxID: "10640646500018",
  knowsAbout: ["Fenêtres PVC", "Fenêtres aluminium", "Fenêtres bois", "Volets roulants", "Volets battants", "Portes de garage sectionnelles", "Portes d'entrée", "Portails", "Clôtures", "Moustiquaires"],
};

// ---------- Blog : lecture des articles ----------
function lireArticles() {
  return fs.readdirSync("content/blog").filter((f) => f.endsWith(".md")).map((f) => {
    const brut = fs.readFileSync(path.join("content/blog", f), "utf8");
    const m = brut.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const meta = {};
    m[1].split("\n").forEach((l) => { const i = l.indexOf(":"); meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    const vues = new Set();
    meta.sources = (meta.sources || "").split(" ; ").filter(Boolean).map((s) => { const [label, url] = s.split("|"); return { label, url }; })
      .filter((s) => (vues.has(s.url) ? false : vues.add(s.url)));
    return { slug: f.replace(/\.md$/, ""), ...meta, md: m[2] };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---------- Mini-Markdown ----------
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function inline(t) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, txt, url) =>
      /^https?:/.test(url) ? `<a href="${url}" class="ext" target="_blank" rel="noopener">${txt}</a>` : `<a href="${url}">${txt}</a>`);
}
function markdown(md) {
  const lignes = md.split("\n"); const out = []; const toc = []; let i = 0;
  while (i < lignes.length) {
    const l = lignes[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{2,3}) (.+)/))) {
      const id = slugify(m[2]); if (m[1] === "##") toc.push({ id, t: m[2] });
      out.push(`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`); i++; continue;
    }
    if (l.startsWith("|")) {
      const rows = []; while (i < lignes.length && lignes[i].startsWith("|")) rows.push(lignes[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(rows[0]); const body = rows.slice(2).map(cells);
      out.push(`<div class="tab-scroll"><table><thead><tr>${head.map((h) => `<th scope="col">${inline(h)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c, j) => (j === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^- /.test(l)) { const it = []; while (i < lignes.length && /^- /.test(lignes[i])) it.push(lignes[i++].slice(2)); out.push(`<ul>${it.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`); continue; }
    if (/^\d+\. /.test(l)) { const it = []; while (i < lignes.length && /^\d+\. /.test(lignes[i])) it.push(lignes[i++].replace(/^\d+\. /, "")); out.push(`<ol>${it.map((x) => `<li>${inline(x)}</li>`).join("")}</ol>`); continue; }
    if (l.startsWith("> ")) { const it = []; while (i < lignes.length && lignes[i].startsWith("> ")) it.push(lignes[i++].slice(2)); out.push(`<blockquote><p>${inline(it.join(" "))}</p></blockquote>`); continue; }
    const p = []; while (i < lignes.length && lignes[i].trim() && !/^(#|\||- |\d+\. |> )/.test(lignes[i])) p.push(lignes[i++]);
    out.push(`<p>${inline(p.join(" "))}</p>`);
  }
  return { html: out.join("\n"), toc };
}

// ---------- Maillage interne automatique (à la Link Whisper) ----------
// Pour chaque cible : expressions qui déclenchent un lien. Un lien par cible et par page, jamais vers soi-même,
// jamais dans un titre ni dans un lien existant, plafonné pour rester naturel.
const CIBLES = [
  { url: "/blog/tva-reduite-5-5-fenetres/", mots: ["TVA à 5,5 %", "TVA réduite", "taux réduit", "5,5 %", "Uw"] },
  { url: "/blog/declaration-prealable-changer-fenetres/", mots: ["déclaration préalable", "architecte des Bâtiments de France", "PLU", "règlement de copropriété", "mairie"] },
  { url: "/blog/pose-renovation-ou-depose-totale/", mots: ["dépose totale", "pose en rénovation", "ancien dormant", "dormant", "calfeutrement"] },
  { url: "/blog/fenetre-pvc-aluminium-ou-bois/", mots: ["PVC, aluminium ou bois", "rupture de pont thermique", "mixte bois-alu", "bois-aluminium", "profils fins", "PVC"] },
  { url: "/blog/fenetre-isolation-phonique-lyon/", mots: ["vitrage acoustique", "isolation phonique", "vitrage asymétrique", "bruit"] },
  { url: "/blog/condensation-fenetre-double-vitrage/", mots: ["condensation", "buée", "VMC", "entrées d'air", "humidité"] },
  { url: "/blog/volet-roulant-filaire-radio-ou-solaire/", mots: ["moteur solaire", "moteur radio", "moteur filaire", "motorisation", "motoriser"] },
  { url: "/blog/porte-de-garage-sectionnelle-ou-laterale/", mots: ["sectionnelle latérale", "sectionnelle plafond", "retombée de linteau", "porte basculante", "basculante"] },
  { url: "/blog/portail-battant-ou-coulissant/", mots: ["portail coulissant", "portail battant", "refoulement", "autoportant"] },
  { url: "/blog/moustiquaire-moustique-tigre-lyon/", mots: ["moustique tigre", "moustiques"] },
  { url: "/blog/prix-fenetre-sur-mesure/", mots: ["comparer deux devis", "prix d'une fenêtre", "fait varier le prix", "devis détaillé", "budget"] },
  { url: "/fenetres/", mots: ["fenêtres sur mesure", "fenêtre sur mesure", "double vitrage", "triple vitrage", "oscillo-battant", "baies coulissantes", "baie coulissante", "fenêtres"] },
  { url: "/volets/", mots: ["volets roulants", "volet roulant", "volets battants", "volet battant", "volets"] },
  { url: "/portes-de-garage/", mots: ["portes de garage", "porte de garage", "garage"] },
  { url: "/portes-d-entree/", mots: ["portes d'entrée", "porte d'entrée"] },
  { url: "/portails-clotures/", mots: ["portails", "portail", "clôtures", "clôture"] },
  { url: "/moustiquaires/", mots: ["moustiquaires", "moustiquaire"] },
  { url: "/professionnels/", mots: ["professionnels", "syndic", "bailleurs", "architectes"] },
  { url: "/contact/", mots: ["demandez une visite", "Demandez une visite", "demander une visite", "visite gratuite", "visite"] },
];
const LETTRE = "A-Za-zÀ-ÖØ-öø-ÿœŒ";
function mailler(html, selfUrl, max = 9) {
  const dejaLies = new Set([...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]));
  dejaLies.add(selfUrl);
  let compte = 0;
  return html.replace(/<(p|li|td)( [^>]*)?>([\s\S]*?)<\/\1>/g, (bloc, tag, attrs = "", contenu) => {
    let dansBloc = 0;
    for (const c of CIBLES) {
      if (compte >= max || dansBloc >= 2) break;
      if (dejaLies.has(c.url)) continue;
      for (const mot of c.mots) {
        const re = new RegExp(`(^|[^${LETTRE}])(${mot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![${LETTRE}])`);
        const parts = contenu.split(/(<a [\s\S]*?<\/a>|<[^>]+>)/);
        let fait = false;
        for (let k = 0; k < parts.length; k++) {
          if (parts[k].startsWith("<")) continue;
          const m = parts[k].match(re);
          if (m) {
            const pos = m.index + m[1].length;
            parts[k] = parts[k].slice(0, pos) + `<a href="${c.url}">${m[2]}</a>` + parts[k].slice(pos + m[2].length);
            fait = true; break;
          }
        }
        if (fait) { contenu = parts.join(""); dejaLies.add(c.url); compte++; dansBloc++; break; }
      }
    }
    return `<${tag}${attrs || ""}>${contenu}</${tag}>`;
  });
}

// ---------- Gabarit ----------
const COURT = { "portes-de-garage": "Garage", "portails-clotures": "Portails" };
const NAV = [...produits.map((p) => ({ url: `/${p.slug}/`, t: COURT[p.slug] || p.nav })), { url: "/professionnels/", t: "Pros" }, { url: "/blog/", t: "Conseils" }];
function entete(url, accueil) {
  return `<header class="top${accueil ? "" : " clair"}"><div class="wrap">
<a class="marque" href="/"><img src="/assets/img/icon-light-52.webp" srcset="/assets/img/icon-light-52.webp 1x, /assets/img/icon-light-104.webp 2x" width="52" height="39" alt="" fetchpriority="high"><span><i>Horizon</i><b>Fenêtre</b></span></a>
<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
<nav class="nav" id="nav" aria-label="Navigation principale"><ul>${NAV.map((n) => `<li><a href="${n.url}"${url.startsWith(n.url) ? ' aria-current="page"' : ""}>${n.t}</a></li>`).join("")}</ul>
<a class="btn btn-or" href="/contact/">Demander un devis</a></nav></div></header>`;
}
const pied = () => `<footer class="pied"><div class="wrap"><div class="cols">
<div><a class="marque" href="/"><img src="/assets/img/icon-light-52.webp" srcset="/assets/img/icon-light-52.webp 1x, /assets/img/icon-light-104.webp 2x" width="52" height="39" alt="" loading="lazy"><span><i>Horizon</i><b>Fenêtre</b></span></a>
<p>Menuiserie sur mesure, fourniture et pose.<br>${ADRESSE.rue}<br>${ADRESSE.cp} ${ADRESSE.ville}</p>
<p><a href="tel:${TEL_LIEN}">${TEL}</a><br><a href="mailto:${MAIL}">${MAIL}</a></p></div>
<div><h2>Nos produits</h2><ul>${produits.map((p) => `<li><a href="/${p.slug}/">${p.nav}</a></li>`).join("")}</ul></div>
<div><h2>Horizon Fenêtre</h2><ul><li><a href="/professionnels/">Professionnels</a></li><li><a href="/blog/">Conseils et guides</a></li><li><a href="/contact/">Contact et devis</a></li><li><a href="/mentions-legales/">Mentions légales</a></li></ul></div>
<div><h2>Guides populaires</h2><ul><li><a href="/blog/fenetre-pvc-aluminium-ou-bois/">PVC, alu ou bois ?</a></li><li><a href="/blog/tva-reduite-5-5-fenetres/">TVA à 5,5 %</a></li><li><a href="/blog/prix-fenetre-sur-mesure/">Prix d'une fenêtre</a></li><li><a href="/blog/declaration-prealable-changer-fenetres/">Déclaration préalable</a></li></ul></div>
</div><div class="bas"><span>© ${new Date().getFullYear()} Horizon Fenêtre, une marque d'ESCOM HABITAT SARL</span><span>Interventions à Lyon, dans le Rhône et l'Ain</span></div></div></footer>
<div class="barre-mobile"><a href="tel:${TEL_LIEN}">${icoTel}Appeler</a><a href="/contact/">Devis gratuit</a></div>`;

const JS = `<script>(function(){var b=document.querySelector('.menu-btn'),n=document.getElementById('nav');if(b){b.addEventListener('click',function(){var o=n.classList.toggle('ouvert');b.setAttribute('aria-expanded',o);b.textContent=o?'Fermer':'Menu';});}})();</script>`;

function page({ url, title, description, body, schemas = [], accueil = false, noindex = false, ogType = "website" }) {
  const canon = SITE + url;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canon}">${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">'}
<meta property="og:locale" content="fr_FR"><meta property="og:type" content="${ogType}"><meta property="og:site_name" content="Horizon Fenêtre"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canon}"><meta property="og:image" content="${SITE}/assets/img/og-horizon-fenetre.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#25313a"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/assets/img/icon-192.png" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/montserrat.woff2" as="font" type="font/woff2" crossorigin>
<style>${css}</style>${schemas.map(ld).join("")}</head><body>
<a class="skip" href="#contenu">Aller au contenu</a>${entete(url, accueil)}<main id="contenu">${body}</main>${pied()}${JS}</body></html>`;
}

const fil = (items) => `<nav class="fil" aria-label="Fil d'Ariane"><ol>${items.map((it, i) => (i < items.length - 1 ? `<li><a href="${it.url}">${it.t}</a></li>` : `<li aria-current="page">${it.t}</li>`)).join("")}</ol></nav>`;
const filLd = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.t, item: SITE + it.url })) });
const faqHtml = (faq) => `<div class="faq">${faq.map(([q, r]) => `<details><summary>${q}</summary><div><p>${r}</p></div></details>`).join("")}</div>`;
const faqLd = (faq) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: r } })) });
const appel = (titre = "Un projet ? On passe le mesurer.") => `<section class="appel"><div class="wrap"><div><h2>${titre}</h2><p>Visite, prise de cotes et devis détaillé gratuits, à Lyon et alentours.</p></div><div class="actions" style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center"><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-sombre" href="/contact/">Demander un devis</a></div></div></section>`;

function formulaire(source) {
  const options = [...produits.map((p) => p.nav), "Autre / plusieurs produits"];
  return `<form class="form" action="https://formsubmit.co/${MAIL}" method="POST">
<input type="hidden" name="_subject" value="Nouvelle demande de devis – site Horizon Fenêtre"><input type="hidden" name="_template" value="table"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="_next" value="${SITE}/merci/"><input type="hidden" name="Page d'origine" value="${source}">
<input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">
<div><label for="f-nom-${source}">Nom et prénom</label><input id="f-nom-${source}" name="Nom" autocomplete="name" required></div>
<div><label for="f-tel-${source}">Téléphone</label><input id="f-tel-${source}" name="Téléphone" type="tel" autocomplete="tel" required></div>
<div><label for="f-mail-${source}">E-mail</label><input id="f-mail-${source}" name="email" type="email" autocomplete="email" required></div>
<div><label for="f-cp-${source}">Commune du chantier</label><input id="f-cp-${source}" name="Commune" autocomplete="address-level2" required></div>
<fieldset class="plein"><legend>Vous êtes</legend><div class="choix"><label><input type="radio" name="Profil" value="Particulier" checked> Particulier</label><label><input type="radio" name="Profil" value="Professionnel"> Professionnel</label></div></fieldset>
<div class="plein"><label for="f-prod-${source}">Votre projet concerne</label><select id="f-prod-${source}" name="Produit">${options.map((o) => `<option>${o}</option>`).join("")}</select></div>
<fieldset class="plein"><legend>Prestation souhaitée</legend><div class="choix"><label><input type="radio" name="Prestation" value="Fourniture et pose" checked> Fourniture et pose</label><label><input type="radio" name="Prestation" value="Fourniture seule"> Fourniture seule</label></div></fieldset>
<div class="plein"><label for="f-msg-${source}">Décrivez votre projet</label><textarea id="f-msg-${source}" name="Message" placeholder="Nombre de fenêtres, dimensions approximatives, matériau souhaité, délai…"></textarea></div>
<div class="plein"><button class="btn btn-or" type="submit">Envoyer ma demande</button> <p class="note" style="margin-top:.8rem">Réponse sous 24 h ouvrées. Vos coordonnées servent uniquement à vous recontacter au sujet de votre projet.</p></div>
</form>`;
}

// ---------- Écriture ----------
const ecrire = (url, html) => { const d = path.join(OUT, url); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, "index.html"), html); };
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync("public", OUT, { recursive: true });
const articles = lireArticles();
const plan = [];

// ===== Accueil =====
{
  const ordreCat = ["fenetres", "volets", "portes-de-garage", "portes-d-entree", "portails-clotures", "moustiquaires"];
  const cat = ordreCat.map((s, i) => { const p = produits.find((x) => x.slug === s); return `<a href="/${p.slug}/"${i === 0 ? ' class="grand"' : ""}>${dessins[p.slug]}<h3>${p.nav}</h3><p>${p.court}</p><span class="voir">Voir les ${p.nav.toLowerCase()}</span></a>`; }).join("")
    + `<a href="/professionnels/">${dessins.professionnels}<h3>Professionnels</h3><p>Syndics, bailleurs, architectes, commerces : chiffrage sur plans.</p><span class="voir">Offre pros</span></a>`;
  const faq = [
    ["La visite et le devis sont-ils vraiment gratuits ?", "Oui. On se déplace, on prend les cotes de chaque ouverture et on vous remet un devis détaillé, sans engagement."],
    ["Dans quel secteur intervenez-vous ?", "À Lyon et dans toute la métropole, ainsi que dans le sud de l'Ain (Côtière, Dombes) et le Val de Saône. Pour un chantier plus éloigné, appelez-nous."],
    ["Faites-vous la pose vous-mêmes ?", "Oui. Celui qui prend les cotes est aussi celui qui suit la pose : pas de relais entre un commercial et une équipe qui ne se connaissent pas."],
    ["Pouvez-vous fournir sans poser ?", "Oui, en fourniture seule pour les professionnels et les particuliers qui ont leur propre poseur."],
    ["Quel taux de TVA s'applique ?", "Dans un logement de plus de deux ans, 5,5 % pour les menuiseries performantes fournies et posées, 10 % pour les autres travaux d'amélioration, 20 % en neuf. Le taux est précisé sur chaque ligne du devis."],
  ];
  const derniers = articles.slice(0, 3).map((a) => `<a class="billet" href="/blog/${a.slug}/"><span class="rub">${a.rubrique}</span><h3>${a.h1}</h3><p>${a.resume}</p><span class="meta">Lire le guide</span></a>`).join("");
  const body = `
<section class="hero"><div class="wrap hero-grid">
<div><h1><small>Menuiserie sur mesure à Lyon et Rillieux-la-Pape</small><span class="l">Mesuré chez vous.</span><span class="l">Fabriqué à vos cotes.</span><span class="l">Posé par nous.</span></h1>
<p class="chapo">Fenêtres PVC, aluminium et bois, volets, portes de garage, portes d'entrée, portails et moustiquaires. Pour les particuliers comme pour les professionnels, de la prise de cotes à la dernière vis.</p>
<div class="actions"><a class="btn btn-or" href="/contact/">Demander une visite gratuite</a><a class="btn btn-ligne" href="tel:${TEL_LIEN}">${icoTel}${TEL}</a></div>
<ul class="hero-gammes" aria-label="Nos gammes">${produits.map((p) => `<li><a href="/${p.slug}/">${p.nav}</a></li>`).join("")}</ul></div>
<div class="scene" aria-hidden="true"><div class="halo"></div><div class="cadre"><div class="baie"><div class="ciel"></div><div class="soleil"></div>${ville}
</div><div class="battants"><div class="vantail g"><div class="chassis"></div></div><div class="vantail d"><div class="chassis"></div><span class="poignee"></span></div></div></div><div class="appui"></div></div>
</div></section>

<section class="sec" id="produits"><div class="wrap"><div class="tete"><h2>Tout ce qui ouvre et ferme une maison</h2><p>Sept familles de produits, toutes fabriquées sur mesure. Un seul interlocuteur, du premier rendez-vous à la réception du chantier.</p></div>
<div class="cat">${cat}</div></div></section>

<section class="sec brume"><div class="wrap"><div class="tete"><h2>PVC, aluminium ou bois</h2><p>Il n'y a pas de meilleur matériau dans l'absolu, il y a celui qui convient à votre façade, à votre budget et au temps que vous voulez passer à l'entretenir.</p></div>
<div class="tab-scroll"><table class="mat"><thead><tr><th scope="col"><span class="sr">Critère</span></th><th scope="col">PVC</th><th scope="col">Aluminium</th><th scope="col">Bois</th></tr></thead><tbody>
<tr><th scope="row">On le choisit pour</th><td>Isoler au meilleur prix, sans entretien</td><td>Des profils fins et de grandes baies</td><td>La matière, le cachet, les secteurs protégés</td></tr>
<tr><th scope="row">Isolation</th><td>Très bonne</td><td>Bonne à très bonne, avec rupture de pont thermique</td><td>Très bonne</td></tr>
<tr><th scope="row">Entretien</th><td>Un coup d'éponge</td><td>Un coup d'éponge</td><td>Lasure ou peinture régulière</td></tr>
<tr><th scope="row">Couleurs</th><td>Blanc, plaxés unis et effet bois</td><td>Quasi toutes les teintes RAL</td><td>Lasures, peintures, essences</td></tr>
<tr><th scope="row">Budget</th><td>Le plus accessible</td><td>Plus élevé</td><td>Plus élevé</td></tr>
</tbody><caption>Le comparatif complet est dans notre guide <a href="/blog/fenetre-pvc-aluminium-ou-bois/">fenêtre PVC, aluminium ou bois</a>.</caption></table></div></div></section>

<section class="sec sombre"><div class="wrap"><div class="tete"><h2>Comment se passe un chantier</h2><p>Cinq étapes, avec la même personne de bout en bout.</p></div>
<ol class="etapes">
<li><h3>Visite et prise de cotes</h3><p>On mesure chaque ouverture, on regarde l'état des dormants, l'accès et les contraintes de la façade.</p></li>
<li><h3>Devis détaillé</h3><p>Chaque produit est décrit ligne par ligne : dimensions, matériau, vitrage, performances, type de pose, TVA.</p></li>
<li><h3>Commande et fabrication</h3><p>Après validation, on vérifie les cotes une dernière fois et on lance la fabrication sur mesure.</p></li>
<li><h3>Pose</h3><p>Dépose des anciennes menuiseries, pose, calfeutrement, habillages. Les gravats repartent avec nous.</p></li>
<li><h3>Réglages et réception</h3><p>On règle chaque ouvrant devant vous, on vous montre l'entretien et on vous remet les garanties.</p></li>
</ol></div></section>

<section class="sec"><div class="wrap duo">
<div><h2>Particuliers</h2><p>Maison ou appartement, rénovation d'une seule fenêtre ou de toute la façade : on vous conseille sans pousser à la gamme la plus chère.</p>
<ul><li>Visite et devis gratuits</li><li>TVA à 5,5 % appliquée quand votre logement y a droit</li><li>Aide pour la déclaration préalable en mairie</li><li>Chantier propre, anciennes menuiseries évacuées</li></ul>
<a class="btn btn-sombre" href="/contact/">Demander une visite</a></div>
<div><h2>Professionnels</h2><p>Syndics, bailleurs, architectes, maîtres d'œuvre, agences, commerces et artisans du bâtiment.</p>
<ul><li>Chiffrage rapide sur plans ou après visite</li><li>Fourniture seule ou fourniture et pose</li><li>Planning tenu en site occupé</li><li>Un interlocuteur unique sur tout le chantier</li></ul>
<a class="btn btn-or" href="/professionnels/">Voir l'offre pros</a></div>
</div></section>

<section class="sec brume"><div class="wrap zone"><div><h2>Où nous intervenons</h2><p>Basés à Rillieux-la-Pape, nous intervenons dans Lyon et toute la métropole, dans la Côtière et la Dombes côté Ain, et dans le Val de Saône. Les communes ci-contre sont celles où nous posons le plus souvent ; si la vôtre n'y figure pas, appelez-nous.</p><p><a href="tel:${TEL_LIEN}">${TEL}</a></p></div>
<ul class="communes">${COMMUNES.map((c) => `<li>${c}</li>`).join("")}</ul></div></section>

<section class="sec"><div class="wrap"><div class="tete"><h2>Conseils et guides</h2><p>Les réponses aux questions qu'on nous pose le plus souvent en visite.</p></div><div class="billets">${derniers}</div>
<p style="margin-top:2rem"><a class="btn btn-sombre" href="/blog/">Tous les guides</a></p></div></section>

<section class="sec brume"><div class="wrap"><div class="tete"><h2>Questions fréquentes</h2></div>${faqHtml(faq)}</div></section>

<section class="sec" id="devis"><div class="wrap zone"><div><h2>Demandez votre visite gratuite</h2><p>Décrivez-nous votre projet en quelques lignes. On vous rappelle pour fixer un rendez-vous de prise de cotes.</p><p>Vous préférez téléphoner ?<br><a href="tel:${TEL_LIEN}" style="font-size:1.4rem;font-weight:800">${TEL}</a></p></div>${formulaire("accueil")}</div></section>`;
  ecrire("/", page({ url: "/", accueil: true, title: "Menuiserie sur mesure à Lyon : fenêtres, volets, portes | Horizon Fenêtre", description: "Fenêtres PVC, alu et bois, volets, portes de garage, portes d'entrée, portails et moustiquaires sur mesure. Fourniture et pose à Lyon et Rillieux-la-Pape.", body,
    schemas: [{ "@context": "https://schema.org", "@graph": [ENTREPRISE, { "@type": "WebSite", "@id": SITE + "/#site", url: SITE + "/", name: "Horizon Fenêtre", inLanguage: "fr-FR", publisher: { "@id": SITE + "/#entreprise" } }] }, faqLd(faq)] }));
  plan.push({ url: "/", prio: "1.0" });
}

// ===== Pages produits =====
for (const p of produits) {
  const url = `/${p.slug}/`;
  const items = [{ url: "/", t: "Accueil" }, { url, t: p.nav }];
  const lies = articles.filter((a) => a.md.includes(`](/${p.slug}/)`)).slice(0, 4);
  const voisins = produits.filter((x) => x.slug !== p.slug).slice(0, 3);
  const contenu = mailler(p.contenu, url, 5);
  const body = `<section class="bandeau"><div class="wrap">${fil(items)}<div class="grille"><div><h1>${p.h1}</h1><p>${p.chapo}</p></div>${dessins[p.slug]}</div></div></section>
<div class="wrap corps"><article class="prose">${contenu}<h2>Questions fréquentes</h2>${faqHtml(p.faq)}</article>
<aside class="cote"><div class="boite fonce"><h2>Visite et devis gratuits</h2><p>On vient prendre les cotes chez vous et on vous remet un devis détaillé.</p><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-or" href="/contact/">Demander un devis</a></div>
${lies.length ? `<div class="boite"><h2>Nos guides</h2><ul>${lies.map((a) => `<li><a href="/blog/${a.slug}/">${a.h1}</a></li>`).join("")}</ul></div>` : ""}</aside></div>
<section class="sec brume" style="padding-top:3rem;padding-bottom:3rem"><div class="wrap"><h2 style="font-size:1.5rem">Nos autres produits</h2><div class="voisins">${voisins.map((v) => `<a href="/${v.slug}/">${dessins[v.slug]}${v.nav}</a>`).join("")}</div></div></section>${appel()}`;
  ecrire(url, page({ url, title: p.title, description: p.description, body, schemas: [
    { "@context": "https://schema.org", "@type": "Service", name: p.h1, serviceType: p.nav, description: p.description, provider: ENTREPRISE, areaServed: ENTREPRISE.areaServed, url: SITE + url },
    filLd(items), faqLd(p.faq)] }));
  plan.push({ url, prio: "0.9" });
}

// ===== Professionnels =====
{
  const url = "/professionnels/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Professionnels" }];
  const faq = [
    ["Travaillez-vous sur plans ?", "Oui. Envoyez-nous les plans et le descriptif, on vous retourne un chiffrage. Les cotes définitives sont toujours relevées sur place avant fabrication."],
    ["Faites-vous la fourniture seule pour les artisans ?", "Oui, avec conseil technique sur le choix des gammes et des poses."],
    ["Intervenez-vous en site occupé ?", "Oui, logement par logement, avec un planning communiqué aux occupants et un chantier rendu propre chaque soir."],
  ];
  const contenu = mailler(`
<p class="lead">On connaît les contraintes d'un chantier professionnel : un budget validé en amont, des délais qui s'enchaînent avec les autres corps d'état et des occupants à prévenir. On s'organise autour.</p>
<h2>Pour qui ?</h2>
<ul>
<li><strong>Syndics et copropriétés</strong> : remplacement des menuiseries d'un immeuble, mise en conformité avec le modèle voté en assemblée, interventions logement par logement.</li>
<li><strong>Bailleurs et gestionnaires de patrimoine</strong> : remise en état entre deux locations, amélioration de la performance énergétique avant mise en location.</li>
<li><strong>Architectes et maîtres d'œuvre</strong> : chiffrage sur CCTP, conseil sur les gammes, respect des prescriptions et des teintes.</li>
<li><strong>Agences immobilières</strong> : un interlocuteur fiable à recommander à vos clients acquéreurs.</li>
<li><strong>Commerces, restaurants et hôtels</strong> : portes d'entrée aluminium, vitrines, fermetures et volets roulants de sécurité.</li>
<li><strong>Artisans du bâtiment</strong> : fourniture seule de menuiseries sur mesure avec conseil technique.</li>
</ul>
<h2>Ce que nous apportons</h2>
<h3>Un chiffrage rapide et lisible</h3>
<p>Sur plans, CCTP ou après visite, on vous remet un devis poste par poste, avec les performances de chaque produit (Uw, Sw, Ud, affaiblissement acoustique) pour vos dossiers.</p>
<h3>Fourniture seule ou fourniture et pose</h3>
<p>Selon votre organisation, on livre les menuiseries ou on les pose. Dans les deux cas, on peut faire le relevé de cotes pour sécuriser la fabrication.</p>
<h3>Un chantier tenu</h3>
<p>Planning communiqué à l'avance, information des occupants, protection des parties communes, évacuation des déchets. Un seul interlocuteur du devis à la réception.</p>
<h3>Les documents dont vous avez besoin</h3>
<p>Fiches techniques, procès-verbaux de performance, attestations de TVA à faire signer par vos clients, éléments pour les dossiers de déclaration préalable.</p>
<h2>Nos produits</h2>
<p>Toute notre gamme est disponible pour les professionnels : <a href="/fenetres/">fenêtres PVC, aluminium et bois</a>, <a href="/volets/">volets roulants et battants</a>, <a href="/portes-de-garage/">portes de garage</a>, <a href="/portes-d-entree/">portes d'entrée</a>, <a href="/portails-clotures/">portails et clôtures</a> et <a href="/moustiquaires/">moustiquaires</a>.</p>`, url, 4);
  const body = `<section class="bandeau"><div class="wrap">${fil(items)}<div class="grille"><div><h1>${pros.h1}</h1><p>${pros.chapo}</p></div>${dessins.professionnels}</div></div></section>
<div class="wrap corps"><article class="prose">${contenu}<h2>Questions fréquentes</h2>${faqHtml(faq)}</article>
<aside class="cote"><div class="boite fonce"><h2>Un dossier à chiffrer ?</h2><p>Envoyez-nous vos plans ou appelez-nous pour organiser une visite.</p><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-or" href="/contact/">Nous écrire</a></div><div class="boite"><h2>Par e-mail</h2><p><a href="mailto:${MAIL}">${MAIL}</a></p></div></aside></div>${appel("Un chantier à chiffrer ? Parlons-en.")}`;
  ecrire(url, page({ url, title: pros.title, description: pros.description, body, schemas: [{ "@context": "https://schema.org", "@type": "Service", name: pros.h1, audience: { "@type": "BusinessAudience" }, provider: ENTREPRISE, areaServed: ENTREPRISE.areaServed, url: SITE + url }, filLd(items), faqLd(faq)] }));
  plan.push({ url, prio: "0.8" });
}

// ===== Blog =====
{
  const url = "/blog/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Conseils" }];
  const cartes = articles.map((a, i) => `<a class="billet${i === 0 ? " une" : ""}" href="/blog/${a.slug}/"><div><span class="rub">${a.rubrique}</span><h3>${a.h1}</h3></div><div><p>${a.resume}</p><span class="meta">${dateFr(a.date)}</span></div></a>`).join("");
  const body = `<section class="bandeau"><div class="wrap">${fil(items)}<h1>Conseils et guides menuiserie</h1><p>Choisir ses fenêtres, comprendre un devis, connaître les règles et les aides : ce qu'on explique tous les jours en visite, par écrit.</p></div></section>
<section class="sec"><div class="wrap"><div class="billets">${cartes}</div></div></section>${appel()}`;
  ecrire(url, page({ url, title: "Conseils fenêtres, volets, portes et portails | Blog Horizon Fenêtre", description: "Guides pratiques pour choisir ses fenêtres, volets, portes de garage et portails : matériaux, pose, TVA à 5,5 %, déclaration préalable, prix.", body,
    schemas: [{ "@context": "https://schema.org", "@type": "Blog", name: "Conseils Horizon Fenêtre", url: SITE + url, publisher: { "@id": SITE + "/#entreprise" }, blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.h1, url: `${SITE}/blog/${a.slug}/`, datePublished: a.date })) }, filLd(items)] }));
  plan.push({ url, prio: "0.7" });

  for (const a of articles) {
    const aurl = `/blog/${a.slug}/`;
    const it = [{ url: "/", t: "Accueil" }, { url: "/blog/", t: "Conseils" }, { url: aurl, t: a.h1 }];
    const { html, toc } = markdown(a.md);
    const corps = mailler(html, aurl, 9);
    const mots = a.md.split(/\s+/).length;
    const proches = [...articles.filter((x) => x.slug !== a.slug && x.rubrique === a.rubrique), ...articles.filter((x) => x.slug !== a.slug && x.rubrique !== a.rubrique)].slice(0, 3);
    const produitLie = produits.find((p) => a.md.includes(`](/${p.slug}/)`));
    const body = `<section class="bandeau"><div class="wrap">${fil(it)}<h1>${a.h1}</h1><p>${a.resume}</p><p class="art-meta">${a.rubrique}, publié le <time datetime="${a.date}">${dateFr(a.date)}</time>, ${Math.max(3, Math.round(mots / 220))} min de lecture</p></div></section>
<div class="wrap corps"><article class="prose">
${toc.length > 2 ? `<nav class="sommaire" aria-label="Sommaire"><p>Au sommaire</p><ol>${toc.map((t) => `<li><a href="#${t.id}">${t.t}</a></li>`).join("")}</ol></nav>` : ""}
${corps}
${a.sources.length ? `<div class="sources"><h2>Sources et liens utiles</h2><ul>${a.sources.map((s) => `<li><a href="${s.url}" class="ext" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul></div>` : ""}
</article>
<aside class="cote"><div class="boite fonce"><h2>Un projet en tête ?</h2><p>Visite, prise de cotes et devis détaillé gratuits.</p><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-or" href="/contact/">Demander un devis</a></div>
${produitLie ? `<div class="boite"><h2>Le produit</h2><ul><li><a href="/${produitLie.slug}/">${produitLie.h1}</a></li></ul></div>` : ""}
<div class="boite"><h2>À lire aussi</h2><ul>${proches.map((x) => `<li><a href="/blog/${x.slug}/">${x.h1}</a></li>`).join("")}</ul></div></aside></div>
<section class="sec brume" style="padding-top:3.5rem;padding-bottom:3.5rem"><div class="wrap"><h2 style="font-size:1.6rem">Continuer la lecture</h2><div class="billets">${proches.map((x) => `<a class="billet" href="/blog/${x.slug}/"><span class="rub">${x.rubrique}</span><h3>${x.h1}</h3><p>${x.resume}</p></a>`).join("")}</div></div></section>${appel()}`;
    ecrire(aurl, page({ url: aurl, ogType: "article", title: a.title, description: a.description, body, schemas: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.h1, description: a.description, datePublished: a.date, dateModified: a.date, inLanguage: "fr-FR", mainEntityOfPage: SITE + aurl, image: SITE + "/assets/img/og-horizon-fenetre.jpg", author: { "@type": "Organization", name: "Horizon Fenêtre", url: SITE + "/" }, publisher: { "@type": "Organization", name: "Horizon Fenêtre", logo: { "@type": "ImageObject", url: SITE + "/assets/img/icon-512.png" } }, keywords: a.motcle, articleSection: a.rubrique, wordCount: mots },
      filLd(it)] }));
    plan.push({ url: aurl, prio: "0.6", date: a.date });
  }
}

// ===== Contact =====
{
  const url = "/contact/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Contact et devis" }];
  const body = `<section class="bandeau"><div class="wrap">${fil(items)}<h1>Demander un devis ou une visite</h1><p>Quelques lignes suffisent. On vous rappelle pour fixer un rendez-vous de prise de cotes, chez vous ou sur le chantier.</p></div></section>
<div class="wrap corps"><div>${formulaire("contact")}</div>
<aside class="cote coord"><div class="boite fonce"><h2>Par téléphone</h2><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><p>Le moyen le plus rapide pour fixer une visite.</p></div>
<div class="boite"><h2>Par e-mail</h2><p><a href="mailto:${MAIL}">${MAIL}</a></p></div>
<div class="boite"><h2>Adresse</h2><p>Horizon Fenêtre – ESCOM HABITAT<br>${ADRESSE.rue}<br>${ADRESSE.cp} ${ADRESSE.ville}</p></div></aside></div>`;
  ecrire(url, page({ url, title: "Contact et devis gratuit | Horizon Fenêtre, Rillieux-la-Pape", description: `Demandez une visite et un devis gratuit pour vos fenêtres, volets, portes ou portail. Appelez le ${TEL} ou écrivez-nous. Lyon et alentours.`, body,
    schemas: [{ "@context": "https://schema.org", "@type": "ContactPage", url: SITE + url, about: ENTREPRISE }, filLd(items)] }));
  plan.push({ url, prio: "0.8" });
}

// ===== Mentions légales, merci, 404 =====
{
  const url = "/mentions-legales/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Mentions légales" }];
  const body = `<section class="bandeau"><div class="wrap">${fil(items)}<h1>Mentions légales</h1></div></section><div class="wrap corps"><article class="prose">
<h2>Éditeur du site</h2><p>Horizon Fenêtre est un nom commercial de la société <strong>ESCOM HABITAT</strong>, SARL.<br>Siège social : ${ADRESSE.rue}, ${ADRESSE.cp} ${ADRESSE.ville}.<br>SIRET : 106 406 465 00018. TVA intracommunautaire : FR70 106 406 465.<br>Téléphone : ${TEL}. E-mail : <a href="mailto:${MAIL}">${MAIL}</a>.<br>Directeur de la publication : Antoine Escolle.</p>
<h2>Hébergement</h2><p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. <a href="https://vercel.com" class="ext" target="_blank" rel="noopener">vercel.com</a></p>
<h2>Données personnelles</h2><p>Les informations envoyées via le formulaire de contact (nom, téléphone, e-mail, commune, description du projet) servent uniquement à répondre à votre demande et à établir un devis. Elles ne sont ni vendues ni cédées. Elles sont conservées le temps nécessaire au traitement de votre demande puis, sans suite commerciale, supprimées dans un délai de trois ans. Le formulaire est transmis par le service FormSubmit.</p>
<p>Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:${MAIL}">${MAIL}</a>. Vous pouvez aussi saisir la <a href="https://www.cnil.fr" class="ext" target="_blank" rel="noopener">CNIL</a>.</p>
<h2>Cookies</h2><p>Ce site ne dépose aucun cookie publicitaire ni de mesure d'audience.</p>
<h2>Propriété intellectuelle</h2><p>Les textes, dessins et le logo Horizon Fenêtre sont la propriété d'ESCOM HABITAT. Toute reproduction sans autorisation est interdite.</p></article></div>`;
  ecrire(url, page({ url, title: "Mentions légales | Horizon Fenêtre", description: "Mentions légales du site Horizon Fenêtre, marque d'ESCOM HABITAT SARL à Rillieux-la-Pape : éditeur, hébergement, données personnelles.", body, schemas: [filLd(items)] }));
  plan.push({ url, prio: "0.2" });
  ecrire("/merci/", page({ url: "/merci/", noindex: true, title: "Demande envoyée | Horizon Fenêtre", description: "Votre demande a bien été envoyée.", body: `<section class="bandeau"><div class="wrap"><h1>Demande envoyée</h1><p>Merci. On vous rappelle sous 24 h ouvrées pour fixer la visite. Pour une urgence : <a href="tel:${TEL_LIEN}" style="color:#fff">${TEL}</a>.</p><p style="margin-top:1.5rem"><a class="btn btn-or" href="/blog/">Lire nos guides en attendant</a></p></div></section>` }));
  fs.writeFileSync(path.join(OUT, "404.html"), page({ url: "/404/", noindex: true, title: "Page introuvable | Horizon Fenêtre", description: "Cette page n'existe pas ou a été déplacée.", body: `<section class="bandeau"><div class="wrap"><h1>Cette page n'existe pas</h1><p>Elle a peut-être été déplacée. Repartez de l'accueil ou consultez nos produits.</p><p style="margin-top:1.5rem"><a class="btn btn-or" href="/">Retour à l'accueil</a></p></div></section>` }));
}

// ===== Sitemap, robots, manifest =====
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${plan.map((p) => `<url><loc>${SITE}${p.url}</loc><lastmod>${p.date || today}</lastmod><priority>${p.prio}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /merci/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({ name: "Horizon Fenêtre", short_name: "Horizon Fenêtre", start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: "#25313a", icons: [{ src: "/assets/img/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/img/icon-512.png", sizes: "512x512", type: "image/png" }] }));
console.log(`OK : ${plan.length} pages indexables, ${articles.length} articles.`);
