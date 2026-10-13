// Générateur statique du site Horizon Fenêtre — aucune dépendance.
// node build.mjs  → dossier dist/
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { produits, pros } from "./src/produits.mjs";
import { dessins } from "./src/dessins.mjs";
import { photo, PHOTOS, CREDITS } from "./src/photos.mjs";
const ORDRE = ["fenetres", "baies-vitrees", "volets", "brise-soleil-orientables", "portes-d-entree", "portes-de-garage", "portes-interieures", "portails-clotures", "moustiquaires"];
const PRODUITS = ORDRE.map((s) => produits.find((p) => p.slug === s));

const SITE = "https://www.horizonfenetre.com";
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
  description: "Fourniture de menuiseries sur mesure : fenêtres PVC, aluminium et bois, baies vitrées, volets, brise-soleil, portes de garage, portes d'entrée et intérieures, portails, clôtures et moustiquaires. Visite et prise de cotes à domicile ; pose par installateur partenaire.",
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
  knowsAbout: ["Baies vitrées", "Brise-soleil orientables", "Portes intérieures", "Fenêtres PVC", "Fenêtres aluminium", "Fenêtres bois", "Volets roulants", "Volets battants", "Portes de garage sectionnelles", "Portes d'entrée", "Portails", "Clôtures", "Moustiquaires"],
};

// ---------- Blog : lecture des articles ----------
const UNE = ["aides-changement-fenetres-2026", "prix-fenetre-sur-mesure", "fenetre-pvc-aluminium-ou-bois", "tva-reduite-5-5-fenetres", "baie-vitree-coulissante-ou-galandage", "bso-ou-volet-roulant"];
function lireArticles() {
  return fs.readdirSync("content/blog").filter((f) => f.endsWith(".md")).map((f) => {
    const brut = fs.readFileSync(path.join("content/blog", f), "utf8");
    const m = brut.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const meta = {};
    m[1].split("\n").forEach((l) => { const i = l.indexOf(":"); meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    const vues = new Set();
    meta.sources = (meta.sources || "").split(" ; ").filter(Boolean).map((s) => { const [label, url] = s.split("|"); return { label, url }; })
      .filter((s) => (vues.has(s.url) ? false : vues.add(s.url)));
    return { slug: f.replace(/\.md$/, ""), ...meta, md: m[2], lecture: Math.max(2, Math.round(m[2].split(/\s+/).length / 200)) };
  }).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (UNE.indexOf(a.slug) + 1 || 99) - (UNE.indexOf(b.slug) + 1 || 99)));
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
  { url: "/blog/aides-changement-fenetres-2026/", mots: ["MaPrimeRénov'", "éco-PTZ"] },
  { url: "/blog/bso-ou-volet-roulant/", mots: ["confort d'été", "protection solaire"] },
  { url: "/blog/porte-entree-alu-ou-pvc/", mots: ["ouvrant caché", "ouvrants cachés"] },
  { url: "/blog/baie-vitree-coulissante-ou-galandage/", mots: ["baie à galandage"] },
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
  { url: "/blog/prix-fenetre-sur-mesure/", mots: ["comparer deux devis", "prix d'une fenêtre", "fait varier le prix", "devis détaillé"] },
  { url: "/baies-vitrees/", mots: ["baies vitrées", "baie vitrée", "baies coulissantes", "baie coulissante", "galandage"] },
  { url: "/brise-soleil-orientables/", mots: ["brise-soleil orientables", "brise-soleil orientable", "brise-soleil", "BSO"] },
  { url: "/portes-interieures/", mots: ["portes intérieures", "porte intérieure", "bloc-porte"] },
  { url: "/fenetres/", mots: ["fenêtres sur mesure", "fenêtre sur mesure", "double vitrage", "triple vitrage", "oscillo-battant", "fenêtres"] },
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

const vignette = (a, grand = false) => (a.photo ? `<span class="vignette">${photo(a.photo, { ratio: [16, 10], largeurs: grand ? [480, 800, 1200] : [400, 640], sizes: grand ? "(max-width: 900px) 100vw, 55vw" : "(max-width: 600px) 100vw, 33vw" })}</span>` : "");

// ---------- Icônes ----------
const ico = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  regle: ico('<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>'),
  usine: ico('<path d="M3 21V10l6 4V10l6 4V6h6v15z"/><path d="M7 18h2M12 18h2M17 18h2"/>'),
  outil: ico('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.4-.6-.6-2.4z"/>'),
  fleche: ico('<path d="M5 12h14M13 6l6 6-6 6"/>'),
};

// ---------- Gabarit ----------
function entete(url) {
  return `<header class="top"><div class="barre">
<a class="marque" href="/"><img src="/assets/img/icon-46.webp" srcset="/assets/img/icon-46.webp 1x, /assets/img/icon-92.webp 2x" width="46" height="35" alt="" fetchpriority="high"><span><i>Horizon</i><b>Fenêtre</b></span></a>
<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
<nav class="nav" id="nav" aria-label="Navigation principale"><ul>
<li class="deroule"><details><summary${PRODUITS.some((p) => url === `/${p.slug}/`) ? ' class="actif"' : ""}>Nos produits</summary><ul class="sous">${PRODUITS.map((p) => `<li><a href="/${p.slug}/"${url === `/${p.slug}/` ? ' aria-current="page"' : ""}>${p.nav}</a></li>`).join("")}</ul></details></li>
${[["/professionnels/", "Professionnels"], ["/blog/", "Conseils"], ["/contact/", "Contact"]].map(([u, t]) => `<li><a href="${u}"${url.startsWith(u) ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul>
<a class="btn btn-p" href="/contact/">Demander un devis</a></nav></div></header>`;
}
const pied = () => `<footer class="pied"><div class="wrap"><div class="cols">
<div><a class="marque" href="/"><img src="/assets/img/icon-light-46.webp" srcset="/assets/img/icon-light-46.webp 1x, /assets/img/icon-light-92.webp 2x" width="46" height="35" alt="" loading="lazy"><span><i>Horizon</i><b>Fenêtre</b></span></a>
<p>Menuiseries sur mesure : conseil, prise de cotes et fourniture. Pose sur demande.<br>${ADRESSE.rue}<br>${ADRESSE.cp} ${ADRESSE.ville}</p>
<p><a href="tel:${TEL_LIEN}">${TEL}</a><br><a href="mailto:${MAIL}">${MAIL}</a></p></div>
<div><h2>Nos produits</h2><ul>${PRODUITS.map((p) => `<li><a href="/${p.slug}/">${p.nav}</a></li>`).join("")}</ul></div>
<div><h2>Horizon Fenêtre</h2><ul><li><a href="/professionnels/">Professionnels</a></li><li><a href="/blog/">Conseils et guides</a></li><li><a href="/contact/">Contact et devis</a></li><li><a href="/partenaires/">Partenaires</a></li><li><a href="/plan-du-site/">Plan du site</a></li><li><a href="/mentions-legales/">Mentions légales</a></li><li><a href="/confidentialite/">Confidentialité</a></li></ul></div>
<div><h2>Guides populaires</h2><ul><li><a href="/blog/fenetre-pvc-aluminium-ou-bois/">PVC, alu ou bois ?</a></li><li><a href="/blog/aides-changement-fenetres-2026/">Aides 2026</a></li><li><a href="/blog/prix-fenetre-sur-mesure/">Prix d'une fenêtre</a></li><li><a href="/blog/declaration-prealable-changer-fenetres/">Déclaration préalable</a></li></ul></div>
</div><div class="bas"><span>© ${new Date().getFullYear()} Horizon Fenêtre, une marque d'ESCOM HABITAT SARL</span><span>Ce site ne dépose aucun cookie</span></div></div></footer>
<div class="barre-mobile"><a href="tel:${TEL_LIEN}">${icoTel}Appeler</a><a href="/contact/">Devis gratuit</a></div>`;

// Mesure d'audience Vercel (sans cookie) : chemins des scripts fournis par Vercel, modifiables ici si le tableau de bord en indique d'autres.
const SCRIPT_ANALYTICS = "/_vercel/insights/script.js";
const SCRIPT_SPEED = "/_vercel/speed-insights/script.js";
const MESURE = `<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments)};</script><script defer src="${SCRIPT_ANALYTICS}"></script><script defer src="${SCRIPT_SPEED}"></script>`;
const JS = `<script>(function(){document.addEventListener('click',function(e){document.querySelectorAll('.deroule details[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open');});});var b=document.querySelector('.menu-btn'),n=document.getElementById('nav');if(b){b.addEventListener('click',function(){var o=n.classList.toggle('ouvert');b.setAttribute('aria-expanded',o);b.textContent=o?'Fermer':'Menu';});}var pc=document.querySelector('.parcours');if(pc&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var r=pc.getBoundingClientRect();if(r.top>innerHeight){pc.classList.add('anim');var po=new IntersectionObserver(function(es){if(es[0].isIntersecting){pc.classList.add('vu');po.disconnect();}},{threshold:.25});po.observe(pc);}}var bm=document.querySelector('.barre-mobile');if(bm&&'IntersectionObserver' in window){var gene=new Set();function maj(){bm.classList.toggle('visible',scrollY>320&&gene.size===0);}var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?gene.add(e.target):gene.delete(e.target);});maj();});document.querySelectorAll('main form,#devis,.pied,.appel,.h-txt .actions,.boite-appel').forEach(function(el){io.observe(el);});addEventListener('scroll',maj,{passive:true});maj();}})();</script>`;

// Image mise en avant (partage, Google) : illustration locale 1200×630 ou photo Unsplash recadrée.
function imageUne(cle) {
  const p = cle && PHOTOS[cle];
  if (!p) return { src: SITE + "/assets/img/og-horizon-fenetre.jpg", alt: "Horizon Fenêtre, menuiseries sur mesure" };
  const src = p[0].startsWith("local:") ? `${SITE}/assets/img/og/${p[0].slice(6)}.jpg` : `https://images.unsplash.com/${p[0]}?w=1200&h=630&fit=crop&crop=entropy&fm=jpg&q=80`;
  return { src, alt: p[3] };
}
function page({ url, title, description, body, schemas = [], noindex = false, ogType = "website", preload = "", une = null }) {
  const img = une ? (typeof une === "string" && une.startsWith("http") ? { src: une, alt: title } : imageUne(une)) : imageUne(null);
  const canon = SITE + url;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canon}">${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">'}
<meta property="og:locale" content="fr_FR"><meta property="og:type" content="${ogType}"><meta property="og:site_name" content="Horizon Fenêtre"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canon}"><meta property="og:image" content="${img.src}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(img.alt)}"><meta name="twitter:image" content="${img.src}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#e9f6fb"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/assets/img/icon-192.png" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/montserrat.woff2" as="font" type="font/woff2" crossorigin>${preload}
<style>${css}</style>${schemas.map(ld).join("")}</head><body>
<a class="skip" href="#contenu">Aller au contenu</a>${entete(url)}<main id="contenu">${body}</main>${pied()}${JS}${noindex ? "" : MESURE}</body></html>`;
}

const fil = (items) => `<nav class="fil" aria-label="Fil d'Ariane"><ol>${items.map((it, i) => (i < items.length - 1 ? `<li><a href="${it.url}">${it.t}</a></li>` : `<li aria-current="page">${it.t}</li>`)).join("")}</ol></nav>`;
const filLd = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.t, item: SITE + it.url })) });
const faqHtml = (faq) => `<div class="faq">${faq.map(([q, r]) => `<details><summary>${q}</summary><div><p>${r}</p></div></details>`).join("")}</div>`;
const faqLd = (faq) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: r } })) });
const appel = (titre = "Un projet ? On passe le mesurer.") => `<section class="appel"><div class="wrap"><div class="boite-appel"><div><h2>${titre}</h2><p>Visite, prise de cotes et devis de fourniture gratuits, à Lyon et alentours.</p></div><div class="actions" style="align-items:center"><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-p" href="/contact/">Demander un devis</a></div></div></div></section>`;
const bandeauPhoto = (items, h1, chapo, cle) => `<section class="bandeau"><div class="wrap">${fil(items)}<div class="grille"><div><h1>${h1}</h1><p>${chapo}</p></div><div class="cadre-photo">${photo(cle, { eager: true, ratio: [4, 3], largeurs: [480, 720, 960], sizes: "(max-width: 760px) 100vw, 42vw" })}</div></div></div></section>`;
const bandeauSimple = (items, h1, chapo, extra = "") => `<section class="bandeau"><div class="wrap">${items ? fil(items) : ""}<h1>${h1}</h1>${chapo ? `<p>${chapo}</p>` : ""}${extra}</div></section>`;

function formulaire(source) {
  const options = [...PRODUITS.map((p) => p.nav), "Plusieurs produits / autre"];
  const id = (n) => `f-${n}-${source}`;
  return `<form class="form" action="/api/contact" method="POST">
<input type="hidden" name="origine" value="${source}">
<div class="sr" aria-hidden="true"><label for="${id("site")}">Ne pas remplir</label><input id="${id("site")}" type="text" name="site_web" tabindex="-1" autocomplete="off"></div>
<div><label for="${id("nom")}">Nom et prénom</label><input id="${id("nom")}" name="nom" autocomplete="name" required maxlength="120"></div>
<div><label for="${id("tel")}">Téléphone</label><input id="${id("tel")}" name="telephone" type="tel" autocomplete="tel" required maxlength="30"></div>
<div><label for="${id("mail")}">E-mail</label><input id="${id("mail")}" name="email" type="email" autocomplete="email" required maxlength="160"></div>
<div><label for="${id("prod")}">Votre projet concerne</label><select id="${id("prod")}" name="produit">${options.map((o) => `<option>${o}</option>`).join("")}</select></div>
<div class="plein"><label for="${id("msg")}">Décrivez votre projet</label><textarea id="${id("msg")}" name="message" maxlength="3000" placeholder="Commune, nombre de menuiseries, dimensions approximatives, matériau souhaité, pose ou fourniture seule…"></textarea></div>
<div class="plein"><button class="btn btn-p" type="submit">Envoyer ma demande</button>
<p class="note">ESCOM HABITAT traite vos données pour répondre à votre demande. Vos droits : <a href="/confidentialite/">politique de confidentialité</a>.</p></div>
</form>`;
}

// ---------- Écriture ----------
// ---------- Dates de modification réelles (pour le sitemap) ----------
// src/dates.json associe à chaque URL l'empreinte de son contenu et la date à laquelle ce contenu a changé.
// En local, le fichier est mis à jour ; sur Vercel, il est seulement lu (dates stables d'un déploiement à l'autre).
const FICHIER_DATES = "src/dates.json";
const DATES = fs.existsSync(FICHIER_DATES) ? JSON.parse(fs.readFileSync(FICHIER_DATES, "utf8")) : {};
const AUJOURDHUI = new Date().toISOString().slice(0, 10);
const empreinte = (t) => crypto.createHash("sha1").update(t).digest("hex").slice(0, 16);
function dateDe(url, contenu, defaut) {
  const h = empreinte(contenu); const prec = DATES[url];
  if (prec && prec.h === h) return prec.d;
  const d = process.env.VERCEL ? (prec ? prec.d : defaut || AUJOURDHUI) : (prec ? AUJOURDHUI : defaut || AUJOURDHUI);
  if (!process.env.VERCEL) DATES[url] = { h, d };
  return d;
}
const INFOS = {};
const ecrire = (url, html) => {
  const d = path.join(OUT, url); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, "index.html"), html);
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const images = [...new Set([...main.matchAll(/<img class="ph[^"]*" src="([^"]+)"[^>]*alt="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, "&").replace(/&w=\d+/, "&w=1200") + "\u0000" + m[2]))];
  INFOS[url] = { main, images: images.map((x) => { const [loc, titre] = x.split("\u0000"); return { loc: SITE + loc, titre }; }) };
};
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync("public", OUT, { recursive: true });
const articles = lireArticles();
const plan = [];
const parcours = `<ol class="parcours">
<li><h3>Visite et prise de cotes</h3><p>On vient chez vous, on vous conseille et on relève chaque ouverture au millimètre.</p></li>
<li><h3>Devis de fourniture et pose</h3><p>Chaque menuiserie détaillée : cotes, matériau, vitrage, performances.</p></li>
<li><h3>Fabrication et livraison</h3><p>Dernier contrôle des cotes, fabrication sur mesure, livraison calée avec le poseur.</p></li>
<li><h3>Pose avec décennale</h3><p>On organise la pose avec notre poseur partenaire, assuré en garantie décennale.</p></li>
</ol>`;

// ===== Accueil =====
{
  const tailles = { fenetres: "c2", "baies-vitrees": "l2", volets: "l2", "portes-de-garage": "l2", "portails-clotures": "l2" };
  const VIGNETTES = {};
  const bento = PRODUITS.map((p) => `<a href="/${p.slug}/" class="${tailles[p.slug] || ""}${PHOTOS[VIGNETTES[p.slug] || p.photo][2] > PHOTOS[VIGNETTES[p.slug] || p.photo][1] ? ` portrait" style="--flou:url(/assets/img/produits/${PHOTOS[VIGNETTES[p.slug] || p.photo][0].slice(6)}-flou.webp)` : ""}">${photo(VIGNETTES[p.slug] || p.photo, { ratio: tailles[p.slug] === "c2" ? [1, 1] : tailles[p.slug] ? [2, 1] : [1, 1], largeurs: tailles[p.slug] ? [560, 800, 1200] : [400, 560], sizes: tailles[p.slug] ? "(max-width: 560px) 100vw, 50vw" : "(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw" })}<span class="fl">${I.fleche}</span><span class="txt"><h3>${p.nav}</h3><p>${p.court}</p></span></a>`).join("");
  const faq = [
    ["La visite et le devis sont-ils gratuits ?", "Oui. On se déplace, on prend les cotes de chaque ouverture et on vous remet un devis détaillé de fourniture, sans engagement."],
    ["Qui pose les menuiseries ?", "Horizon Fenêtre vend la fourniture. La pose est réalisée par notre installateur partenaire, qui vous remet son propre devis et sa propre facture. Vous restez libre de faire poser par l'artisan de votre choix."],
    ["Quel taux de TVA s'applique ?", "La fourniture vendue par Horizon Fenêtre est facturée avec une TVA à 20 %. Le taux appliqué à la pose figure sur le devis de l'installateur : il dépend de son intervention et de votre logement."],
    ["Dans quel secteur intervenez-vous ?", "À Lyon et dans toute la métropole, dans le sud de l'Ain (Côtière, Dombes) et le Val de Saône. Pour un projet plus éloigné, appelez-nous."],
    ["Vendez-vous aux professionnels ?", "Oui. Artisans, syndics, bailleurs, architectes et commerces : chiffrage sur plans ou après visite, livraison sur chantier."],
  ];
  const derniers = articles.slice(0, 3).map((a) => `<a class="billet" href="/blog/${a.slug}/">${vignette(a)}<span class="rub">${a.rubrique}<em>${a.lecture} min de lecture</em></span><h3>${a.h1}</h3><p>${a.resume}</p><span class="meta">Lire le guide</span></a>`).join("");
  const body = `
<section class="hero-photo"><picture><source type="image/avif" srcset="/assets/img/baie-coulissante-aluminium-jardin-640.avif 640w, /assets/img/baie-coulissante-aluminium-jardin-960.avif 960w, /assets/img/baie-coulissante-aluminium-jardin-1280.avif 1280w, /assets/img/baie-coulissante-aluminium-jardin-1920.avif 1920w, /assets/img/baie-coulissante-aluminium-jardin-2560.avif 2560w, /assets/img/baie-coulissante-aluminium-jardin-3840.avif 3840w" sizes="100vw"><img class="h-img" src="/assets/img/baie-coulissante-aluminium-jardin-1920.webp" srcset="/assets/img/baie-coulissante-aluminium-jardin-640.webp 640w, /assets/img/baie-coulissante-aluminium-jardin-960.webp 960w, /assets/img/baie-coulissante-aluminium-jardin-1280.webp 1280w, /assets/img/baie-coulissante-aluminium-jardin-1920.webp 1920w, /assets/img/baie-coulissante-aluminium-jardin-2560.webp 2560w, /assets/img/baie-coulissante-aluminium-jardin-3840.webp 3840w" sizes="100vw" width="3840" height="2161" alt="Grande baie vitrée coulissante en aluminium noir ouverte sur une terrasse et un jardin, maison contemporaine équipée de fenêtres à profils fins" fetchpriority="high" decoding="async"></picture>
<div class="wrap h-txt"><span class="kicker">Menuiseries sur mesure à Lyon et Rillieux-la-Pape</span>
<h1><span class="fin">Vos menuiseries</span> <span class="fort">sur mesure</span></h1>
<p class="chapo">Fenêtres, baies vitrées, volets, BSO, portes, portails et moustiquaires. On relève les cotes chez vous, chaque menuiserie est fabriquée à la dimension exacte, et on organise la pose.</p>
<div class="actions"><a class="btn btn-p" href="/contact/">Demander une visite gratuite</a><a class="btn btn-s" href="tel:${TEL_LIEN}">${icoTel}${TEL}</a></div>
<ul class="trio"><li>${I.regle}Visite et prise de cotes gratuites</li><li>${I.usine}Fabrication sur mesure</li><li>${I.outil}Pose organisée par nos soins</li></ul></div>
</section>

<section class="sec"><div class="wrap"><div class="tete"><h2>Comment ça se passe</h2><p>On vous conseille, on mesure, on fournit et on organise la pose : un seul interlocuteur du premier rendez-vous à la fin du chantier.</p></div>
${parcours}</div></section>

<section class="sec ciel" id="produits"><div class="wrap"><div class="tete"><h2>Tout ce qui ouvre et ferme une maison</h2><p>Neuf familles de menuiseries, toutes fabriquées sur mesure.</p></div>
<div class="bento">${bento}</div>
</div></section>

<section class="sec"><div class="wrap"><div class="tete"><h2>PVC, aluminium ou bois</h2><p>Il n'y a pas de meilleur matériau dans l'absolu, il y a celui qui convient à votre façade, à votre budget et au temps que vous voulez passer à l'entretenir.</p></div>
<div class="carte" style="padding:0"><div class="tab-scroll"><table class="mat"><thead><tr><th scope="col"><span class="sr">Critère</span></th><th scope="col">PVC</th><th scope="col">Aluminium</th><th scope="col">Bois</th></tr></thead><tbody>
<tr><th scope="row">On le choisit pour</th><td data-label="PVC">Isoler au meilleur prix, sans entretien</td><td data-label="Aluminium">Des profils fins et de grandes baies</td><td data-label="Bois">La matière, le cachet, les secteurs protégés</td></tr>
<tr><th scope="row">Isolation</th><td data-label="PVC">Très bonne</td><td data-label="Aluminium">Bonne à très bonne, avec rupture de pont thermique</td><td data-label="Bois">Très bonne</td></tr>
<tr><th scope="row">Entretien</th><td data-label="PVC">Un coup d'éponge</td><td data-label="Aluminium">Un coup d'éponge</td><td data-label="Bois">Lasure ou peinture régulière</td></tr>
<tr><th scope="row">Couleurs</th><td data-label="PVC">Blanc, plaxés unis et effet bois</td><td data-label="Aluminium">Quasi toutes les teintes RAL</td><td data-label="Bois">Lasures, peintures, essences</td></tr>
<tr><th scope="row">Budget</th><td data-label="PVC">Le plus accessible</td><td data-label="Aluminium">Plus élevé</td><td data-label="Bois">Plus élevé</td></tr>
</tbody></table></div></div>
<div class="mat-cartes"><article class="mat-carte"><h3>PVC</h3><dl><div><dt>On le choisit pour</dt><dd>Isoler au meilleur prix, sans entretien</dd></div><div><dt>Isolation</dt><dd>Très bonne</dd></div><div><dt>Entretien</dt><dd>Un coup d'éponge</dd></div><div><dt>Couleurs</dt><dd>Blanc, plaxés unis et effet bois</dd></div><div><dt>Budget</dt><dd>Le plus accessible</dd></div></dl></article><article class="mat-carte"><h3>Aluminium</h3><dl><div><dt>On le choisit pour</dt><dd>Des profils fins et de grandes baies</dd></div><div><dt>Isolation</dt><dd>Bonne à très bonne, avec rupture de pont thermique</dd></div><div><dt>Entretien</dt><dd>Un coup d'éponge</dd></div><div><dt>Couleurs</dt><dd>Quasi toutes les teintes RAL</dd></div><div><dt>Budget</dt><dd>Plus élevé</dd></div></dl></article><article class="mat-carte"><h3>Bois</h3><dl><div><dt>On le choisit pour</dt><dd>La matière, le cachet, les secteurs protégés</dd></div><div><dt>Isolation</dt><dd>Très bonne</dd></div><div><dt>Entretien</dt><dd>Lasure ou peinture régulière</dd></div><div><dt>Couleurs</dt><dd>Lasures, peintures, essences</dd></div><div><dt>Budget</dt><dd>Plus élevé</dd></div></dl></article></div>
<p style="margin-top:1.2rem;color:var(--texte-2)">Le comparatif complet est dans notre guide <a href="/blog/fenetre-pvc-aluminium-ou-bois/">fenêtre PVC, aluminium ou bois</a>.</p></div></section>

<section class="sec" style="padding-top:0"><div class="wrap duo">
<div><span class="vignette">${photo("salon", { ratio: [16, 9], largeurs: [480, 800], sizes: "(max-width: 820px) 100vw, 50vw" })}</span><h2>Particuliers</h2><p>Maison ou appartement, une seule fenêtre ou toute la façade : on vous conseille sans pousser à la gamme la plus chère.</p>
<ul><li>Visite et prise de cotes gratuites</li><li>Devis de fourniture détaillé, performances à l'appui</li><li>Pose organisée par nos soins</li><li>Aide pour la déclaration préalable en mairie</li></ul>
<a class="btn btn-p" href="/contact/">Demander une visite</a></div>
<div><span class="vignette">${photo("immeuble", { ratio: [16, 9], largeurs: [480, 800], sizes: "(max-width: 820px) 100vw, 50vw" })}</span><h2>Professionnels</h2><p>Artisans, syndics, bailleurs, architectes, maîtres d'œuvre et commerces.</p>
<ul><li>Chiffrage rapide sur plans ou après visite</li><li>Fourniture sur mesure livrée sur chantier</li><li>Pose possible sur demande</li><li>Un interlocuteur unique pour la fourniture</li></ul>
<a class="btn btn-p" href="/professionnels/">Voir l'offre pros</a></div>
</div></section>

<section class="sec ciel"><div class="wrap zone"><div><h2>Où nous intervenons</h2><p>Basés à Rillieux-la-Pape, nous venons prendre les cotes dans Lyon et toute la métropole, dans la Côtière et la Dombes côté Ain, et dans le Val de Saône. Votre commune n'apparaît pas ? Appelez-nous.</p><p><a href="tel:${TEL_LIEN}">${TEL}</a></p></div>
<ul class="communes">${COMMUNES.map((c) => `<li>${c}</li>`).join("")}</ul></div></section>

<section class="sec"><div class="wrap"><div class="tete"><h2>Conseils et guides</h2><p>Les réponses aux questions qu'on nous pose le plus souvent en visite.</p></div><div class="billets">${derniers}</div>
<p style="margin-top:2rem"><a class="btn btn-s" href="/blog/">Tous les guides</a></p></div></section>

<section class="sec ciel"><div class="wrap"><div class="tete"><h2>Questions fréquentes</h2></div>${faqHtml(faq)}</div></section>

<section class="sec" id="devis"><div class="wrap"><div class="devis"><div><h2>Demandez votre visite gratuite</h2><p>Décrivez votre projet en quelques lignes. On vous rappelle pour fixer un rendez-vous de prise de cotes.</p><p>Vous préférez téléphoner ?<br><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a></p></div>${formulaire("accueil")}</div></div></section>`;
  ecrire("/", page({ url: "/", une: SITE + "/assets/img/og/baie-coulissante-aluminium-jardin.jpg", preload: '<link rel="preload" as="image" type="image/avif" imagesrcset="/assets/img/baie-coulissante-aluminium-jardin-640.avif 640w, /assets/img/baie-coulissante-aluminium-jardin-960.avif 960w, /assets/img/baie-coulissante-aluminium-jardin-1280.avif 1280w, /assets/img/baie-coulissante-aluminium-jardin-1920.avif 1920w, /assets/img/baie-coulissante-aluminium-jardin-2560.avif 2560w, /assets/img/baie-coulissante-aluminium-jardin-3840.avif 3840w" imagesizes="100vw" fetchpriority="high">', title: "Menuisier à Lyon : fenêtres, volets, portes | Horizon Fenêtre", description: "Fenêtres PVC, alu et bois, baies vitrées, volets, BSO, portes, portails sur mesure. Visite et prise de cotes gratuites à Lyon, pose par installateur partenaire.", body,
    schemas: [{ "@context": "https://schema.org", "@graph": [ENTREPRISE, { "@type": "WebSite", "@id": SITE + "/#site", url: SITE + "/", name: "Horizon Fenêtre", inLanguage: "fr-FR", publisher: { "@id": SITE + "/#entreprise" } }] }, faqLd(faq)] }));
  plan.push({ url: "/", groupe: "Horizon Fenêtre", titre: "Accueil" });
}

// ===== Pages produits =====
for (const p of produits) {
  const url = `/${p.slug}/`;
  const items = [{ url: "/", t: "Accueil" }, { url, t: p.nav }];
  const lies = articles.filter((a) => a.md.includes(`](/${p.slug}/)`)).slice(0, 4);
  const voisins = PRODUITS.filter((x) => x.slug !== p.slug).slice(0, 3);
  const galerie = (p.galerie || []).length ? `<div class="galerie">${p.galerie.map(([k, c]) => `<figure>${photo(k, { ratio: [3, 2], largeurs: [400, 640, 900], sizes: "(max-width: 760px) 100vw, 360px" })}<figcaption>${c}</figcaption></figure>`).join("")}</div>` : "";
  const contenu = mailler(p.contenu, url, 6).replace(/(<p class="lead">[\s\S]*?<\/p>)/, `$1${galerie}`);
  const body = `${bandeauPhoto(items, p.h1, p.chapo, p.photo)}
<div class="wrap corps"><article class="prose">${contenu}<h2>Fourniture et pose : comment ça marche</h2><p>Horizon Fenêtre vient relever les cotes et vous fournit la menuiserie sur mesure, facturée avec une TVA à 20 %. Pour la pose, on organise l'intervention de notre poseur partenaire à partir de nos cotes (devis de pose séparé). Vous pouvez aussi la confier à l'artisan de votre choix.</p><h2>Questions fréquentes</h2>${faqHtml(p.faq)}</article>
<aside class="cote"><div class="boite fonce"><h2>Visite et devis gratuits</h2><p>On vient prendre les cotes chez vous et on vous remet un devis de fourniture détaillé.</p><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-p" href="/contact/">Demander un devis</a></div>
${lies.length ? `<div class="boite"><h2>Nos guides</h2><ul>${lies.map((a) => `<li><a href="/blog/${a.slug}/">${a.h1}</a></li>`).join("")}</ul></div>` : ""}</aside></div>
<section class="sec ciel" style="padding-top:3rem;padding-bottom:3rem"><div class="wrap"><h2 style="font-size:1.5rem">Nos autres produits</h2><div class="voisins">${voisins.map((v) => `<a href="/${v.slug}/">${dessins[v.slug]}${v.nav}</a>`).join("")}</div></div></section>${appel()}`;
  ecrire(url, page({ url, une: p.photo, title: p.title, description: p.description, body, schemas: [
    { "@context": "https://schema.org", "@type": "Service", name: p.h1, image: imageUne(p.photo).src, serviceType: `Fourniture de ${p.nav.toLowerCase()} sur mesure`, description: p.description, provider: ENTREPRISE, areaServed: ENTREPRISE.areaServed, url: SITE + url },
    filLd(items), faqLd(p.faq)] }));
  plan.push({ url, groupe: "Nos produits", titre: p.nav });
}

// ===== Professionnels =====
{
  const url = "/professionnels/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Professionnels" }];
  const faq = [
    ["Travaillez-vous sur plans ?", "Oui. Envoyez-nous les plans et le descriptif, on vous retourne un chiffrage de fourniture. Les cotes définitives sont toujours relevées sur place avant fabrication."],
    ["Vendez-vous aux artisans poseurs ?", "Oui, c'est même le cœur de notre métier : fourniture sur mesure, conseil sur les gammes et relevé de cotes si vous le souhaitez."],
    ["Pouvez-vous proposer la pose ?", "Oui, par notre installateur partenaire, sur son propre devis. Utile pour les syndics, bailleurs et commerces qui veulent un interlocuteur pour la pose."],
  ];
  const contenu = mailler(`
<p class="lead">On connaît les contraintes d'un chantier professionnel : un budget validé en amont, des délais qui s'enchaînent avec les autres corps d'état et des menuiseries qui doivent arriver aux bonnes cotes. On s'organise autour.</p>
<h2>Pour qui ?</h2>
<ul>
<li><strong>Artisans du bâtiment</strong> : fourniture de menuiseries sur mesure avec conseil technique, prêtes à poser.</li>
<li><strong>Syndics et copropriétés</strong> : remplacement des menuiseries d'un immeuble, respect du modèle voté en assemblée, pose possible par notre installateur partenaire.</li>
<li><strong>Bailleurs et gestionnaires de patrimoine</strong> : remise en état entre deux locations, amélioration de la performance énergétique.</li>
<li><strong>Architectes et maîtres d'œuvre</strong> : chiffrage sur CCTP, conseil sur les gammes, respect des prescriptions et des teintes.</li>
<li><strong>Commerces, restaurants et hôtels</strong> : portes d'entrée aluminium, vitrines, fermetures et volets roulants de sécurité.</li>
</ul>
<h2>Ce que nous apportons</h2>
<h3>Un chiffrage rapide et lisible</h3>
<p>Sur plans, CCTP ou après visite, on vous remet un devis poste par poste, avec les performances de chaque produit (Uw, Sw, Ud, affaiblissement acoustique) pour vos dossiers.</p>
<h3>Le relevé de cotes</h3>
<p>On peut relever les cotes sur site pour sécuriser la fabrication, ou travailler sur les vôtres si vous préférez.</p>
<h3>La pose en option</h3>
<p>Si vous n'avez pas d'équipe de pose, notre installateur partenaire peut intervenir sur son propre devis. La livraison est calée avec lui.</p>
<h3>Les documents dont vous avez besoin</h3>
<p>Fiches techniques, procès-verbaux de performance, éléments pour les dossiers de déclaration préalable.</p>
<h2>Nos produits</h2>
<p>Toute notre gamme est disponible pour les professionnels : <a href="/fenetres/">fenêtres PVC, aluminium et bois</a>, <a href="/baies-vitrees/">baies vitrées</a>, <a href="/volets/">volets roulants et battants</a>, <a href="/brise-soleil-orientables/">brise-soleil orientables</a>, <a href="/portes-de-garage/">portes de garage</a>, <a href="/portes-d-entree/">portes d'entrée</a>, <a href="/portes-interieures/">portes intérieures</a>, <a href="/portails-clotures/">portails et clôtures</a> et <a href="/moustiquaires/">moustiquaires</a>.</p>`, url, 4);
  const body = `${bandeauPhoto(items, pros.h1, pros.chapo, "immeuble")}
<div class="wrap corps"><article class="prose">${contenu}<h2>Questions fréquentes</h2>${faqHtml(faq)}</article>
<aside class="cote"><div class="boite fonce"><h2>Un dossier à chiffrer ?</h2><p>Envoyez-nous vos plans ou appelez-nous pour organiser une visite.</p><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-p" href="/contact/">Nous écrire</a></div><div class="boite"><h2>Par e-mail</h2><p><a href="mailto:${MAIL}">${MAIL}</a></p></div></aside></div>${appel("Un chantier à chiffrer ? Parlons-en.")}`;
  ecrire(url, page({ url, une: "pPaliere", title: pros.title, description: pros.description, body, schemas: [{ "@context": "https://schema.org", "@type": "Service", name: pros.h1, audience: { "@type": "BusinessAudience" }, provider: ENTREPRISE, areaServed: ENTREPRISE.areaServed, url: SITE + url }, filLd(items), faqLd(faq)] }));
  plan.push({ url, groupe: "Horizon Fenêtre", titre: "Professionnels" });
}

// ===== Blog =====
{
  const url = "/blog/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Conseils" }];
  const cartes = articles.map((a, i) => `<a class="billet${i === 0 ? " une" : ""}" href="/blog/${a.slug}/">${vignette(a, i === 0)}<div><span class="rub">${a.rubrique}<em>${a.lecture} min de lecture</em></span><h3>${a.h1}</h3></div><div><p>${a.resume}</p><span class="meta">${dateFr(a.date)}</span></div></a>`).join("");
  const body = `${bandeauSimple(items, "Conseils et guides menuiserie", "Choisir ses fenêtres, comprendre un devis, connaître les règles et les aides : ce qu'on explique tous les jours en visite, par écrit.")}
<section class="sec"><div class="wrap"><h2 class="sr">Tous nos guides</h2><div class="billets">${cartes}</div></div></section>${appel()}`;
  ecrire(url, page({ url, une: "pFenetre", title: "Conseils fenêtres, volets, portes, portails | Horizon Fenêtre", description: "Guides pratiques pour choisir fenêtres, baies vitrées, volets, portes et portails : matériaux, aides 2026, TVA, déclaration préalable, prix.", body,
    schemas: [{ "@context": "https://schema.org", "@type": "Blog", name: "Conseils Horizon Fenêtre", url: SITE + url, publisher: { "@id": SITE + "/#entreprise" }, blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.h1, url: `${SITE}/blog/${a.slug}/`, datePublished: a.date })) }, filLd(items)] }));
  plan.push({ url, groupe: "Conseils et guides", titre: "Tous les conseils" });

  for (const a of articles) {
    const aurl = `/blog/${a.slug}/`;
    const it = [{ url: "/", t: "Accueil" }, { url: "/blog/", t: "Conseils" }, { url: aurl, t: a.h1 }];
    const { html, toc } = markdown(a.md);
    const corps = mailler(html, aurl, 9);
    const mots = a.md.split(/\s+/).length;
    const modif = dateDe(aurl, fs.readFileSync(path.join("content/blog", a.slug + ".md"), "utf8"), a.date);
    const proches = [...articles.filter((x) => x.slug !== a.slug && x.rubrique === a.rubrique), ...articles.filter((x) => x.slug !== a.slug && x.rubrique !== a.rubrique)].slice(0, 3);
    const produitLie = produits.find((p) => a.md.includes(`](/${p.slug}/)`));
    const body = `${bandeauSimple(it, a.h1, a.resume, `<p class="art-meta">${a.rubrique}, publié le <time datetime="${a.date}">${dateFr(a.date)}</time>${modif > a.date ? `, mis à jour le <time datetime="${modif}">${dateFr(modif)}</time>` : ""}, ${a.lecture} min de lecture</p>`)}
<div class="wrap corps"><article class="prose">
${a.photo ? `<figure class="une-photo">${photo(a.photo, { eager: true, ratio: [16, 9], largeurs: [640, 960, 1280], sizes: "(max-width: 900px) 100vw, 740px" })}</figure>` : ""}
${toc.length > 2 ? `<nav class="sommaire" aria-label="Sommaire"><p>Au sommaire</p><ol>${toc.map((t) => `<li><a href="#${t.id}">${t.t}</a></li>`).join("")}</ol></nav>` : ""}
${corps}
${a.sources.length ? `<div class="sources"><h2>Sources et liens utiles</h2><ul>${a.sources.map((s) => `<li><a href="${s.url}" class="ext" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul></div>` : ""}
</article>
<aside class="cote"><div class="boite fonce"><h2>Un projet en tête ?</h2><p>Visite, prise de cotes et devis de fourniture gratuits.</p><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-p" href="/contact/">Demander un devis</a></div>
${produitLie ? `<div class="boite"><h2>Le produit</h2><ul><li><a href="/${produitLie.slug}/">${produitLie.h1}</a></li></ul></div>` : ""}
<div class="boite"><h2>À lire aussi</h2><ul>${proches.map((x) => `<li><a href="/blog/${x.slug}/">${x.h1}</a></li>`).join("")}</ul></div></aside></div>
<section class="sec ciel" style="padding-top:3.5rem;padding-bottom:3.5rem"><div class="wrap"><h2 style="font-size:1.6rem">Continuer la lecture</h2><div class="billets">${proches.map((x) => `<a class="billet" href="/blog/${x.slug}/">${vignette(x)}<span class="rub">${x.rubrique}<em>${x.lecture} min de lecture</em></span><h3>${x.h1}</h3><p>${x.resume}</p></a>`).join("")}</div></div></section>${appel()}`;
    ecrire(aurl, page({ url: aurl, une: a.photo, ogType: "article", title: a.title, description: a.description, body, schemas: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.h1, description: a.description, datePublished: a.date, dateModified: modif, inLanguage: "fr-FR", mainEntityOfPage: SITE + aurl, image: imageUne(a.photo).src, author: { "@type": "Organization", name: "Horizon Fenêtre", url: SITE + "/" }, publisher: { "@type": "Organization", name: "Horizon Fenêtre", logo: { "@type": "ImageObject", url: SITE + "/assets/img/icon-512.png" } }, keywords: a.motcle, articleSection: a.rubrique, wordCount: mots },
      filLd(it)] }));
    plan.push({ url: aurl, date: modif, groupe: "Conseils et guides", titre: a.h1 });
  }
}

// ===== Contact =====
{
  const url = "/contact/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Contact et devis" }];
  const body = `${bandeauSimple(items, "Demander un devis ou une visite", "Quelques lignes suffisent. On vous rappelle pour fixer un rendez-vous de prise de cotes, chez vous ou sur le chantier.")}
<div class="wrap corps"><div>${formulaire("contact")}</div>
<aside class="cote"><div class="boite fonce"><h2>Par téléphone</h2><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><p>Le moyen le plus rapide pour fixer une visite.</p></div>
<div class="boite"><h2>Par e-mail</h2><p><a href="mailto:${MAIL}">${MAIL}</a></p></div>
<div class="boite"><h2>Adresse</h2><p>Horizon Fenêtre, ESCOM HABITAT<br>${ADRESSE.rue}<br>${ADRESSE.cp} ${ADRESSE.ville}</p></div></aside></div>`;
  ecrire(url, page({ url, une: "pPorte", title: "Contact et devis gratuit | Horizon Fenêtre, Rillieux-la-Pape", description: `Demandez une visite et un devis gratuit pour vos fenêtres, volets, portes ou portail. Appelez le ${TEL} ou écrivez-nous. Lyon et alentours.`, body,
    schemas: [{ "@context": "https://schema.org", "@type": "ContactPage", url: SITE + url, about: ENTREPRISE }, filLd(items)] }));
  plan.push({ url, groupe: "Horizon Fenêtre", titre: "Contact et devis" });
}

// ===== Partenaires =====
{
  const url = "/partenaires/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Partenaires" }];
  const body = `${bandeauSimple(items, "Nos partenaires", "Les entreprises avec qui nous travaillons pour aller au bout de votre projet, de la fenêtre à la terrasse.")}
<div class="wrap corps"><article class="prose">
<h2>Instant Terrasse : vos terrasses sur mesure</h2>
<p class="lead">Une nouvelle baie vitrée appelle souvent une terrasse à sa hauteur. Pour cette partie du projet, nous travaillons avec Instant Terrasse, concepteur de terrasses sur mesure à Lyon et dans sa région.</p>
<p>Instant Terrasse conçoit des terrasses en <strong>bois</strong> (thermopin, thermofrêne, Kebony, Accoya, bambou), en <strong>composite</strong>, en <strong>carrelage et grès cérame</strong> et en <strong>aluminium</strong>. Ses terrasses reposent sur une ossature en aluminium posée sur plots réglables, ventilée sous les lames, plutôt que sur des lambourdes en bois qui finissent par pourrir.</p>
<p>Instant Terrasse et Horizon Fenêtre sont deux marques de la même société, ESCOM HABITAT. Concrètement, si vous changez une baie vitrée et refaites la terrasse au même moment, les cotes du seuil et de la terrasse sont pensées ensemble, avec un seul interlocuteur.</p>
<p><a href="https://www.instantterrasse.com/" class="ext" target="_blank" rel="noopener">Découvrir Instant Terrasse</a></p>
<h2>Notre installateur partenaire</h2>
<p>Horizon Fenêtre vend la fourniture et réalise la prise de cotes. La pose est confiée à un installateur partenaire avec qui nous travaillons régulièrement. Il établit son propre devis et sa propre facture, intervient sur la base de nos cotes, et nous calons ensemble la livraison et la date de pose.</p>
<p>Vos coordonnées ne lui sont transmises que si vous l'acceptez, en cochant la case prévue dans notre <a href="/contact/">formulaire de contact</a>.</p>
<h2>Devenir partenaire</h2>
<p>Vous êtes poseur, artisan du bâtiment, architecte ou apporteur d'affaires dans la région lyonnaise et vous cherchez un fournisseur de menuiseries sur mesure ? Écrivez-nous à <a href="mailto:${MAIL}">${MAIL}</a> ou consultez notre <a href="/professionnels/">offre pour les professionnels</a>.</p>
</article>
<aside class="cote"><div class="boite fonce"><h2>Un projet fenêtre et terrasse ?</h2><p>On vient prendre les cotes et on coordonne les deux.</p><a class="tel" href="tel:${TEL_LIEN}">${TEL}</a><a class="btn btn-p" href="/contact/">Demander un devis</a></div></aside></div>`;
  ecrire(url, page({ url, title: "Nos partenaires : Instant Terrasse et pose | Horizon Fenêtre", description: "Instant Terrasse, concepteur de terrasses sur mesure à Lyon, et notre installateur partenaire pour la pose de vos menuiseries.", body,
    schemas: [{ "@context": "https://schema.org", "@type": "WebPage", name: "Nos partenaires", url: SITE + url, about: [{ "@type": "Organization", name: "Instant Terrasse", url: "https://www.instantterrasse.com/", parentOrganization: { "@type": "Organization", name: "ESCOM HABITAT" } }] }, filLd(items)] }));
  plan.push({ url, groupe: "Horizon Fenêtre", titre: "Partenaires" });
}

const MAJ_CONFIDENTIALITE = "2026-10-12"; // à modifier quand la politique change
// ===== Mentions légales, confidentialité, merci, erreur, 404 =====
{
  const url = "/mentions-legales/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Mentions légales" }];
  const body = `${bandeauSimple(items, "Mentions légales", "")}<div class="wrap corps"><article class="prose">
<h2>Éditeur du site</h2><p>Horizon Fenêtre est un nom commercial de la société <strong>ESCOM HABITAT</strong>, SARL.<br>Siège social : ${ADRESSE.rue}, ${ADRESSE.cp} ${ADRESSE.ville}.<br>SIRET : 106 406 465 00018. TVA intracommunautaire : FR70 106 406 465.<br>Téléphone : ${TEL}. E-mail : <a href="mailto:${MAIL}">${MAIL}</a>.<br>Directeur de la publication : Antoine Escolle.</p>
<h2>Activité</h2><p>ESCOM HABITAT, sous le nom Horizon Fenêtre, vend des menuiseries sur mesure (fourniture seule) et réalise le conseil et la prise de cotes. La pose est réalisée par un installateur partenaire indépendant, qui établit son propre devis et sa propre facture et assume ses propres responsabilités et assurances pour les travaux qu'il réalise.</p>
<h2>Hébergement</h2><p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. <a href="https://vercel.com" class="ext" target="_blank" rel="noopener">vercel.com</a></p>
<h2>Données personnelles et cookies</h2><p>Le traitement de vos données est décrit dans notre <a href="/confidentialite/">politique de confidentialité</a>. Ce site ne dépose aucun cookie. La mesure d'audience est réalisée sans cookie et de façon anonyme.</p>
<h2>Propriété intellectuelle et crédits photo</h2><p>Les textes, dessins, illustrations de produits et le logo Horizon Fenêtre sont la propriété d'ESCOM HABITAT. Toute reproduction sans autorisation est interdite. Les illustrations de produits sont des visuels d'ambiance, non contractuels.</p><p>Les photographies d'illustration proviennent de la banque d'images Unsplash (licence Unsplash) : ${CREDITS.join(", ")}. Elles illustrent les types de produits proposés et ne représentent pas des chantiers réalisés par Horizon Fenêtre.</p></article></div>`;
  ecrire(url, page({ url, title: "Mentions légales | Horizon Fenêtre", description: "Mentions légales du site Horizon Fenêtre, marque d'ESCOM HABITAT SARL à Rillieux-la-Pape : éditeur, activité, hébergement, crédits.", body, schemas: [filLd(items)] }));
  plan.push({ url, groupe: "Informations", titre: "Mentions légales" });

  const curl = "/confidentialite/"; const citems = [{ url: "/", t: "Accueil" }, { url: curl, t: "Politique de confidentialité" }];
  const cbody = `${bandeauSimple(citems, "Politique de confidentialité", "Comment Horizon Fenêtre traite vos données personnelles, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.")}<div class="wrap corps"><article class="prose">
<h2>Responsable du traitement</h2><p>ESCOM HABITAT, SARL, nom commercial Horizon Fenêtre, ${ADRESSE.rue}, ${ADRESSE.cp} ${ADRESSE.ville}. SIRET 106 406 465 00018. Contact pour toute question sur vos données : <a href="mailto:${MAIL}">${MAIL}</a>.</p>
<h2>Données collectées</h2><p>Uniquement celles que vous saisissez dans le formulaire de contact : nom et prénom, téléphone, e-mail, produit concerné et description du projet. Nous ne collectons aucune donnée sensible et vous demandons de ne pas en indiquer dans le message.</p>
<h2>Finalités et bases légales</h2>
<ul>
<li><strong>Répondre à votre demande, organiser la visite et établir un devis de fourniture</strong> : mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).</li>
<li><strong>Transmettre votre demande à notre installateur partenaire</strong> pour qu'il établisse un devis de pose : uniquement si vous souhaitez la pose, au titre des mesures précontractuelles prises à votre demande (article 6.1.b). Si vous achetez la fourniture seule, rien ne lui est transmis.</li>
<li><strong>Gérer la relation commerciale</strong> si vous devenez client (exécution du contrat, obligations comptables et fiscales).</li>
</ul>
<p>Vos données ne sont jamais vendues, louées ni utilisées à des fins de prospection par des tiers. Nous ne faisons aucun profilage ni décision automatisée.</p>
<h2>Destinataires</h2>
<ul>
<li>ESCOM HABITAT (Horizon Fenêtre), seul destinataire de votre demande.</li>
<li>Notre installateur partenaire, uniquement si vous souhaitez la pose.</li>
<li>Nos sous-traitants techniques, tenus par contrat à la confidentialité : l'hébergeur du site et fournisseur des statistiques de visite, Vercel Inc. (États-Unis), et notre prestataire d'envoi d'e-mails, Brevo (Sendinblue SAS, France, données hébergées dans l'Union européenne).</li>
</ul>
<h2>Transferts hors de l'Union européenne</h2><p>L'hébergeur Vercel Inc. est établi aux États-Unis. Il adhère au Data Privacy Framework UE–États-Unis et propose des clauses contractuelles types de la Commission européenne. Les fonctions du site qui reçoivent le formulaire sont exécutées dans la région de Paris. Le site ne charge aucune ressource depuis un autre domaine : les polices et les images sont servies par le site lui-même.</p>
<h2>Durées de conservation</h2>
<ul>
<li>Demandes sans suite : 3 ans au plus après notre dernier échange, puis suppression.</li>
<li>Clients : durée de la relation commerciale, puis archivage pendant les durées légales (10 ans pour les pièces comptables).</li>
<li>Journaux techniques de l'hébergeur : durée limitée fixée par celui-ci, à des fins de sécurité.</li><li>Statistiques de visite : données agrégées et anonymes, sans durée de conservation de données personnelles.</li>
</ul>
<h2>Vos droits</h2><p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement et de définir des directives sur le sort de vos données après votre décès. Pour les exercer, écrivez à <a href="mailto:${MAIL}">${MAIL}</a> ou à l'adresse postale ci-dessus. Nous répondons dans un délai d'un mois.</p>
<p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la <a href="https://www.cnil.fr/fr/plaintes" class="ext" target="_blank" rel="noopener">CNIL</a>.</p>
<h2>Cookies et mesure d'audience</h2><p>Ce site ne dépose aucun cookie et n'utilise aucun pixel publicitaire ni contenu intégré de réseau social.</p><p>Pour savoir quelles pages sont consultées et vérifier la rapidité du site, nous utilisons Vercel Web Analytics et Vercel Speed Insights. Ces outils fonctionnent sans cookie et sans rien enregistrer sur votre appareil. Ils produisent uniquement des statistiques agrégées (pages vues, provenance, type d'appareil, pays, temps de chargement) et ne permettent pas de vous identifier : l'adresse IP n'est pas conservée et l'identifiant technique de visite est renouvelé chaque jour. Ces mesures servent uniquement à améliorer le site (intérêt légitime, article 6.1.f du RGPD). Aucun bandeau de consentement n'est donc nécessaire.</p><p>Si nous ajoutions un jour un outil qui dépose des cookies, votre accord serait demandé au préalable.</p>
<h2>Sécurité</h2><p>Le site est servi exclusivement en HTTPS, avec des en-têtes de sécurité stricts. Le formulaire est protégé contre les envois automatisés sans service tiers de type captcha.</p>
<p><em>Dernière mise à jour : ${dateFr(MAJ_CONFIDENTIALITE)}.</em></p></article></div>`;
  ecrire(curl, page({ url: curl, title: "Politique de confidentialité | Horizon Fenêtre", description: "Données collectées, finalités, durées de conservation, destinataires et droits RGPD : la politique de confidentialité du site Horizon Fenêtre.", body: cbody, schemas: [filLd(citems)] }));
  plan.push({ url: curl, groupe: "Informations", titre: "Politique de confidentialité" });

  ecrire("/merci/", page({ url: "/merci/", noindex: true, title: "Demande envoyée | Horizon Fenêtre", description: "Votre demande a bien été envoyée.", body: bandeauSimple(null, "Demande envoyée", "Merci. On vous rappelle sous 24 h ouvrées pour fixer la visite.", `<p style="margin-top:1.5rem"><a class="btn btn-p" href="/blog/">Lire nos guides en attendant</a></p>`) }));
  ecrire("/erreur-envoi/", page({ url: "/erreur-envoi/", noindex: true, title: "Envoi impossible | Horizon Fenêtre", description: "Votre demande n'a pas pu être envoyée.", body: bandeauSimple(null, "Votre demande n'a pas pu être envoyée", `Vérifiez que les champs obligatoires sont remplis, puis réessayez. Vous pouvez aussi nous appeler au ${TEL} ou écrire à ${MAIL}.`, `<p style="margin-top:1.5rem"><a class="btn btn-p" href="/contact/">Revenir au formulaire</a></p>`) }));
  fs.writeFileSync(path.join(OUT, "404.html"), page({ url: "/404/", noindex: true, title: "Page introuvable | Horizon Fenêtre", description: "Cette page n'existe pas ou a été déplacée.", body: bandeauSimple(null, "Cette page n'existe pas", "Elle a peut-être été déplacée. Repartez de l'accueil ou consultez nos produits.", `<p style="margin-top:1.5rem"><a class="btn btn-p" href="/">Retour à l'accueil</a></p>`) }));
}

// ===== Plan du site (page lisible) =====
{
  const url = "/plan-du-site/"; const items = [{ url: "/", t: "Accueil" }, { url, t: "Plan du site" }];
  plan.push({ url, groupe: "Informations", titre: "Plan du site" });
  const groupes = ["Horizon Fenêtre", "Nos produits", "Conseils et guides", "Informations"];
  const body = `${bandeauSimple(items, "Plan du site", "Toutes les pages du site Horizon Fenêtre.")}<div class="wrap corps"><article class="prose">${groupes.map((g) => `<h2>${g}</h2><ul>${plan.filter((p) => p.groupe === g).map((p) => `<li><a href="${p.url}">${p.titre}</a></li>`).join("")}</ul>`).join("")}</article></div>`;
  ecrire(url, page({ url, title: "Plan du site | Horizon Fenêtre", description: "Plan du site Horizon Fenêtre : produits, conseils et guides, informations pratiques.", body, schemas: [filLd(items)] }));
}

// ===== Sitemap XML, robots, manifest =====
const xml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlsSitemap = plan.map((p) => {
  const info = INFOS[p.url];
  const lastmod = p.date || dateDe(p.url, info.main);
  return `  <url>\n    <loc>${xml(SITE + p.url)}</loc>\n    <lastmod>${lastmod}</lastmod>${info.images.map((im) => `\n    <image:image>\n      <image:loc>${xml(im.loc)}</image:loc>\n    </image:image>`).join("")}\n  </url>`;
});
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlsSitemap.join("\n")}\n</urlset>\n`);
if (!process.env.VERCEL) fs.writeFileSync(FICHIER_DATES, JSON.stringify(Object.fromEntries(Object.entries(DATES).sort()), null, 1) + "\n");
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /merci/\nDisallow: /erreur-envoi/\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({ name: "Horizon Fenêtre", short_name: "Horizon Fenêtre", start_url: "/", display: "standalone", background_color: "#e9f6fb", theme_color: "#566f79", icons: [{ src: "/assets/img/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/img/icon-512.png", sizes: "512x512", type: "image/png" }] }));
console.log(`OK : ${plan.length} pages indexables, ${articles.length} articles.`);
