// Galeries filtrables (porte blindée, volets) et visionneuse plein écran.
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

export const VOLETS = [
  ["battant-lames", "Battants à lames", [
    ["battant-lames-bleu-maison", "Maison de maître en brique et colombages équipée de volets battants aluminium bleus", false],
    ["battant-lames-facade", "Façade de maison dont les trois fenêtres sont équipées de volets battants aluminium gris", false],
    ["battant-lames-porte-fenetre", "Volets battants aluminium gris à lames horizontales ouverts autour d'une porte-fenêtre", false],
    ["battant-lames-fenetre", "Volet battant aluminium gris ouvert contre la façade, à côté d'une fenêtre", false],
    ["battant-lames-porte", "Volet battant aluminium gris à un vantail à côté d'une porte vitrée", false],
  ]],
  ["orientables", "Lames orientables", [
    ["orientables-vert-ferme", "Volets battants vert d'eau fermés, lames orientables entrouvertes sur le jardin", false],
    ["orientables-vert-ouvert", "Volets battants vert d'eau à lames orientables, vus depuis l'intérieur", false],
    ["orientables-brun-detail", "Volet battant brun à lames orientables ouvertes, vu de profil", false],
    ["orientables-brun-facade", "Façade sous auvent bois équipée de volets battants bruns à lames orientables", false],
    ["orientables-brun-porte-fenetre", "Volets battants bruns à lames orientables autour d'une porte-fenêtre en bois", false],
  ]],
];

export const GALERIES = {
  "porte-blindee-lyon": { modeles: MODELES, dir: "/assets/img/produits/blindee/", titre: "Nos portes en images", intro: "Choisissez un modèle pour voir ses finitions. Touchez une photo pour l'agrandir.", tous: "Tous les modèles" },
  volets: { modeles: VOLETS, dir: "/assets/img/produits/volets-g/", titre: "Nos volets battants en images", intro: "Choisissez un type de volet. Touchez une photo pour l'agrandir.", tous: "Tous les volets" },
};

export function galerieModeles({ modeles, dir: D, titre, intro, tous }) {
  const tuiles = modeles.flatMap(([id, , photos]) => photos.map(([f, alt, large]) => {
    const tailles = large ? [800, 1600] : [480, 960];
    return `<li class="gm-t${large ? " gm-l" : ""}" data-modele="${id}"><a href="${D}${f}-1600.webp" aria-label="Agrandir : ${alt}"><img src="${D}${f}-${tailles[0]}.webp" srcset="${tailles.map((w) => `${D}${f}-${w}.webp ${w}w`).join(", ")}" sizes="${large ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 25vw"}" width="${tailles[0]}" height="${large ? Math.round(tailles[0] / 2.8) : tailles[0]}" alt="${alt}" loading="lazy" decoding="async"></a></li>`;
  })).join("");
  const filtres = [["tous", tous, modeles.reduce((n, m) => n + m[2].length, 0)], ...modeles.map(([id, nom, ph]) => [id, nom, ph.length])]
    .map(([id, nom, n], i) => `<button type="button" class="gm-f" data-filtre="${id}" aria-pressed="${i === 0}">${nom} <span>${n}</span></button>`).join("");
  return `<section class="gm" aria-labelledby="gm-titre"><h2 id="gm-titre">${titre}</h2><p>${intro}</p><div class="gm-filtres" role="group" aria-label="Filtrer">${filtres}</div><ul class="gm-grille">${tuiles}</ul></section>`;
}

// Filtres de la galerie par modèle + visionneuse plein écran commune à toutes les galeries du site.
export const JS_GALERIE = `<script>(function(){
var g=document.querySelector('.gm');if(g){var fs=g.querySelectorAll('.gm-f'),gt=[].slice.call(g.querySelectorAll('.gm-t'));fs.forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.filtre;fs.forEach(function(x){x.setAttribute('aria-pressed',x===b);});gt.forEach(function(t){t.hidden=f!=='tous'&&t.dataset.modele!==f;});});});}
var els=[].slice.call(document.querySelectorAll('.gm-t a,.galerie figure'));if(!els.length)return;
var d=document.createElement('dialog');d.className='visio';d.setAttribute('aria-label','Photo en plein écran');
d.innerHTML='<div class="v-scene"><img class="v-img" alt=""></div><p class="v-leg"><span class="v-txt"></span><span class="v-num"></span></p><button type="button" class="v-x" aria-label="Fermer">&times;</button><button type="button" class="v-b v-prec" aria-label="Photo précédente">&#8249;</button><button type="button" class="v-b v-suiv" aria-label="Photo suivante">&#8250;</button>';
document.body.appendChild(d);if(!d.showModal)return;
var im=d.querySelector('.v-img'),tx=d.querySelector('.v-txt'),nu=d.querySelector('.v-num'),i=0,sens=0;
function grand(el){if(el.tagName==='A')return el.href;var p=el.querySelector('img'),s=(p.getAttribute('srcset')||'').split(',').pop().trim().split(' ')[0];return s||p.src;}
function leg(el){var c=el.querySelector('figcaption');return c?c.textContent:el.querySelector('img').alt;}
function vis(){return els.filter(function(e){var t=e.closest('.gm-t');return !(t&&t.hidden);});}
function aff(k,dir){var v=vis(),n=v.length;i=(k+n)%n;var el=v[i],src=grand(el);im.classList.remove('v-in');im.style.setProperty('--dx',(dir||0)*40+'px');var nv=new Image();nv.onload=nv.onerror=function(){im.src=src;im.alt=el.querySelector('img').alt;tx.textContent=leg(el);nu.textContent=(i+1)+' / '+n;requestAnimationFrame(function(){im.classList.add('v-in');});[1,-1].forEach(function(s){var p=new Image();p.src=grand(v[(i+s+n)%n]);});};nv.src=src;}
els.forEach(function(el){var t=el.tagName==='A'?el:el.querySelector('img');t.style.cursor='zoom-in';t.addEventListener('click',function(e){e.preventDefault();aff(vis().indexOf(el),0);d.showModal();document.documentElement.classList.add('visio-on');});});
d.addEventListener('close',function(){document.documentElement.classList.remove('visio-on');im.classList.remove('v-in');});
d.querySelector('.v-x').onclick=function(){d.close();};d.querySelector('.v-prec').onclick=function(){aff(i-1,-1);};d.querySelector('.v-suiv').onclick=function(){aff(i+1,1);};
d.addEventListener('click',function(e){if(e.target===d||e.target.classList.contains('v-scene'))d.close();});
d.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')aff(i-1,-1);if(e.key==='ArrowRight')aff(i+1,1);});
var x0=null;d.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});d.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>45)dx<0?aff(i+1,1):aff(i-1,-1);x0=null;});
})();</script>`;
