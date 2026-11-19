// Galerie filtrable de la page Porte blindée (photos fournies par Picard Serrures).
// [fichier, texte alternatif, panoramique]
export const MODELES = [
  ["diamant-10", "Diamant 10", [
    ["diamant-10-01", "Porte blindée Diamant 10 gris anthracite, détail de la poignée inox", false],
    ["diamant-10-02", "Porte blindée Diamant 10 en décor bois gris dans une entrée lumineuse", true],
    ["diamant-10-03", "Porte blindée Diamant 10 dans une entrée avec verrière", true],
    ["diamant-10-04", "Porte blindée Diamant 10 gris anthracite ouverte sur une entrée", false],
    ["diamant-10-05", "Porte blindée Diamant 10 en décor bois clair, poignée et cylindre", false],
    ["diamant-10-06", "Chant d'une porte blindée Diamant 10 avec ses points de fermeture", false],
    ["diamant-10-07", "Porte blindée Diamant 10 en décor bois gris, entrée à carreaux de ciment", false],
    ["diamant-10-08", "Porte blindée Diamant 10 à panneau mouluré chêne, poignée laiton", false],
    ["diamant-10-09", "Porte blindée Diamant 10 moulurée chêne sur un palier d'immeuble", true],
    ["diamant-10-10", "Porte blindée Diamant 10 en décor chêne clair, entrée en briques blanches", false],
    ["diamant-10-11", "Porte blindée Diamant 10 moulurée chêne ouverte sur le palier", false],
  ]],
  ["diamant-20", "Diamant 20", [
    ["diamant-20-01", "Porte blindée Diamant 20 en décor bois gris, séjour avec verrière", false],
    ["diamant-20-02", "Porte blindée Diamant 20 laquée vert olive dans une entrée", true],
    ["diamant-20-03", "Chant d'une porte blindée Diamant 20 avec ses pênes rotatifs", false],
    ["diamant-20-04", "Porte blindée Diamant 20 en décor bois clair, entrée au mur orangé", true],
    ["diamant-20-05", "Porte blindée Diamant 20 vert olive, détail de la poignée", false],
    ["diamant-20-06", "Pênes rotatifs anti-sciage sur le chant d'une porte Diamant 20", false],
    ["diamant-20-07", "Porte blindée Diamant 20 vert olive ouverte sur une entrée", false],
    ["diamant-20-08", "Porte blindée Diamant 20 en décor bois clair devant un mur orange", false],
    ["diamant-20-09", "Porte blindée Diamant 20 en décor bois clair, poignée inox", false],
    ["diamant-20-10", "Porte blindée Diamant 20 en décor bois foncé, séjour avec verrière", false],
  ]],
  ["opaline", "Opaline", [
    ["opaline-01", "Porte sécurisée Opaline acajou sur un palier d'immeuble", true],
    ["opaline-02", "Porte sécurisée Opaline blanche, détail de la poignée", false],
    ["opaline-03", "Porte sécurisée Opaline en décor chêne, entrée au mur bleu canard", false],
    ["opaline-04", "Porte sécurisée Opaline acajou ouverte sur la cage d'escalier", false],
    ["opaline-05", "Porte sécurisée Opaline acajou, poignée laiton", false],
    ["opaline-06", "Porte sécurisée Opaline en décor chêne, détail de la poignée", false],
    ["opaline-07", "Porte Opaline blanche en porte de communication entre garage et maison", false],
    ["opaline-08", "Porte Opaline posée entre le garage et la maison", true],
  ]],
  ["diamant-tierce", "Diamant tiercé", [
    ["diamant-tierce-01", "Porte blindée Diamant tiercé, détail de la poignée", false],
    ["diamant-tierce-02", "Porte blindée double vantaux Diamant tiercé dans une entrée", true],
    ["diamant-tierce-03", "Porte blindée double vantaux moulurée bois foncé sur un palier ancien", false],
    ["diamant-tierce-04", "Porte blindée double vantaux en décor bois devant un mur bleu nuit", false],
    ["diamant-tierce-05", "Porte blindée double vantaux claire ouverte sur une entrée", false],
    ["diamant-tierce-06", "Moulures d'une porte blindée Diamant tiercé en bois foncé", false],
    ["diamant-tierce-07", "Porte blindée double vantaux dans un hall d'immeuble ancien", true],
    ["diamant-tierce-08", "Chant d'une porte blindée Diamant tiercé avec ses points de fermeture", false],
  ]],
];

const D = "/assets/img/produits/blindee/";
export function galerieModeles() {
  const tuiles = MODELES.flatMap(([id, , photos]) => photos.map(([f, alt, large]) => {
    const tailles = large ? [800, 1600] : [480, 960];
    return `<li class="gm-t${large ? " gm-l" : ""}" data-modele="${id}"><a href="${D}${f}-1600.webp" aria-label="Agrandir : ${alt}"><img src="${D}${f}-${tailles[0]}.webp" srcset="${tailles.map((w) => `${D}${f}-${w}.webp ${w}w`).join(", ")}" sizes="${large ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 25vw"}" width="${tailles[0]}" height="${large ? Math.round(tailles[0] / 2.8) : tailles[0]}" alt="${alt}" loading="lazy" decoding="async"></a></li>`;
  })).join("");
  const filtres = [["tous", "Tous les modèles", MODELES.reduce((n, m) => n + m[2].length, 0)], ...MODELES.map(([id, nom, ph]) => [id, nom, ph.length])]
    .map(([id, nom, n], i) => `<button type="button" class="gm-f" data-filtre="${id}" aria-pressed="${i === 0}">${nom} <span>${n}</span></button>`).join("");
  return `<section class="gm" aria-labelledby="gm-titre"><h2 id="gm-titre">Nos portes en images</h2><p>Choisissez un modèle pour voir ses finitions. Touchez une photo pour l'agrandir.</p><div class="gm-filtres" role="group" aria-label="Filtrer par modèle">${filtres}</div><ul class="gm-grille">${tuiles}</ul></section>
<dialog class="gm-visio" aria-label="Photo agrandie"><img alt=""><p class="gm-leg"></p><button type="button" class="gm-x" aria-label="Fermer">×</button><button type="button" class="gm-prec" aria-label="Photo précédente">‹</button><button type="button" class="gm-suiv" aria-label="Photo suivante">›</button></dialog>`;
}

export const JS_GALERIE = `<script>(function(){var g=document.querySelector('.gm');if(!g)return;var fs=g.querySelectorAll('.gm-f'),ts=[].slice.call(g.querySelectorAll('.gm-t'));fs.forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.filtre;fs.forEach(function(x){x.setAttribute('aria-pressed',x===b);});ts.forEach(function(t){t.hidden=f!=='tous'&&t.dataset.modele!==f;});});});var d=document.querySelector('.gm-visio');if(!d||!d.showModal)return;var im=d.querySelector('img'),lg=d.querySelector('.gm-leg'),i=0;function vis(){return ts.filter(function(t){return !t.hidden;});}function aff(k){var v=vis();i=(k+v.length)%v.length;var a=v[i].querySelector('a'),p=a.querySelector('img');im.src=a.href;im.alt=p.alt;lg.textContent=p.alt;}ts.forEach(function(t){t.querySelector('a').addEventListener('click',function(e){e.preventDefault();aff(vis().indexOf(t));d.showModal();});});d.querySelector('.gm-x').onclick=function(){d.close();};d.querySelector('.gm-prec').onclick=function(){aff(i-1);};d.querySelector('.gm-suiv').onclick=function(){aff(i+1);};d.addEventListener('click',function(e){if(e.target===d)d.close();});d.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')aff(i-1);if(e.key==='ArrowRight')aff(i+1);});})();</script>`;
