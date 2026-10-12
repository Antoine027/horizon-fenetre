(function(){
  // Maison interactive (section produits de l'accueil) : la visite se lance au clic sur un repère ou une étiquette.
  const S = [
    { r:[880,640,1520,700], hero:1 },
    { el:"fen", p:[375,465], r:[375,465,480,330], titre:"Fenêtres", url:"/fenetres/",
      texte:"PVC, aluminium ou bois, double ou triple vitrage. Chaque fenêtre est fabriquée à la cote relevée chez vous, au millimètre.",
      tags:["Oscillo-battant","Rénovation ou neuf","Uw indiqué au devis"] },
    { el:"fen", p:[445,410], r:[375,468,400,290], titre:"Moustiquaires", url:"/moustiquaires/",
      texte:"Enroulables, plissées ou sur cadre fixe, posées dans l'encadrement de la fenêtre. Bien utiles à Lyon, où le moustique tigre est installé.",
      tags:["Enroulable","Plissée","Cadre fixe"] },
    { el:"volet", p:[685,465], r:[685,462,520,340], titre:"Volets roulants et battants", lien:"Voir les volets", url:"/volets/", variantes:1,
      texte:"Roulant motorisé (radio, filaire ou solaire) ou battant en aluminium : choisissez la version pour la voir sur la façade.",
      tags:["Motorisation solaire","Coffre tunnel","Battant alu"] },
    { el:"baie", p:[450,715], r:[450,712,700,380], titre:"Baies vitrées", url:"/baies-vitrees/",
      texte:"Coulissantes ou à galandage, en aluminium à profils fins pour faire entrer un maximum de lumière dans la pièce de vie.",
      tags:["Seuil plat","Grandes dimensions","Galandage"] },
    { el:"bso", p:[765,715], r:[765,712,420,400], titre:"Brise-soleil orientables", url:"/brise-soleil-orientables/",
      texte:"On incline les lames pour couper le soleil d'été sans fermer la pièce. La chaleur reste dehors, la lumière entre.",
      tags:["Lames orientables","Motorisé","Façades sud et ouest"] },
    { el:"entree", p:[960,720], r:[970,715,420,360], titre:"Portes d'entrée", url:"/portes-d-entree/",
      texte:"Aluminium ou PVC, panneau plein ou vitré, serrure multipoints. Le premier élément que l'on voit de la maison, et celui qu'on touche tous les jours.",
      tags:["Serrure multipoints","Isolante","Sur mesure"] },
    { el:"garageG", p:[1205,712], r:[1205,712,540,380], titre:"Portes de garage", url:"/portes-de-garage/",
      texte:"Sectionnelles ou latérales, motorisées, isolées si le garage est chauffé ou communique avec la maison.",
      tags:["Sectionnelle","Latérale","Télécommande"] },
    { el:"portail", p:[1212,890], r:[1212,880,760,280], titre:"Portails et clôtures", url:"/portails-clotures/",
      texte:"Battants ou coulissants, en aluminium, assortis à la clôture et à la porte de garage pour une façade cohérente.",
      tags:["Coulissant","Motorisable","Clôture assortie"] }
  ];
  const NB = S.length - 1;
  const $ = (id) => document.getElementById(id);
  const section = $("visite"), svg = $("maison"), carte = $("carte"), points = $("points"), rail = $("rail");
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lames = Array.from(document.querySelectorAll(".lame"));
  const NS = "http://www.w3.org/2000/svg";
  const cl = (v) => Math.max(0, Math.min(1, v));
  const lisse = (t) => t * t * (3 - 2 * t);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let etape = 0, mode = "roulant", cam = null, depart = null, arrivee = null, t0 = 0, boucle = false;
  const DUREE = reduit ? 0 : 1100;
  const anim = new Array(NB + 1).fill(0);

  // Points dorés et repères
  S.forEach((s, k) => {
    if (!k) return;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "v-point");
    g.innerHTML = `<title>${s.titre}</title><circle cx="${s.p[0]}" cy="${s.p[1]}" r="22" fill="transparent"/><circle class="v-pt" cx="${s.p[0]}" cy="${s.p[1]}" r="8" stroke="#fff" stroke-width="3"/>`;
    g.addEventListener("click", () => aller(k, true));
    points.appendChild(g);
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" aria-pressed="false">${s.titre}</button>`;
    li.firstChild.addEventListener("click", () => aller(k, true));
    rail.appendChild(li);
  });
  const boutons = Array.from(rail.querySelectorAll("button"));

  function cadre(k){
    const s = S[k], aspect = svg.clientWidth / svg.clientHeight, mobile = svg.clientWidth <= 700;
    let [cx, cy, rw, rh] = s.r;
    if (mobile && s.hero) { rw = 1250; rh = 560; }
    const w = Math.max(rw, rh * aspect);
    let ox, oy;
    if (mobile) { ox = 0; oy = s.hero ? 0 : 0.2; }
    else { ox = s.hero ? 0 : -0.19; oy = s.hero ? 0.03 : 0.02; }
    return { cx, cy, w, ox, oy, aspect };
  }
  function poser(c){
    const h = c.w / c.aspect;
    svg.setAttribute("viewBox", `${(c.cx - c.w / 2 + c.ox * c.w).toFixed(1)} ${(c.cy - h / 2 + c.oy * h).toFixed(1)} ${c.w.toFixed(1)} ${h.toFixed(1)}`);
  }
  function melange(a, b, t){
    return { cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, w: a.w * Math.pow(b.w / a.w, t), ox: a.ox + (b.ox - a.ox) * t, oy: a.oy + (b.oy - a.oy) * t, aspect: b.aspect };
  }
  function appliquer(){
    const a = anim.map(lisse);
    const fen = Math.max(a[1], a[2]);
    $("fenG").style.transform = `scaleX(${1 - 0.7 * fen}) skewY(${7 * fen}deg)`;
    $("fenD").style.transform = `scaleX(${1 - 0.7 * fen}) skewY(${-7 * fen}deg)`;
    $("moustiq").style.transform = `translateY(${(-142 + 142 * a[2]).toFixed(1)}px)`;
    if (mode === "roulant") $("tablier").style.transform = `translateY(${(-158 + 158 * 0.78 * a[3]).toFixed(1)}px)`;
    else { const sv = (-0.35 + 1.35 * a[3]).toFixed(3); $("vbG").style.transform = $("vbD").style.transform = `scaleX(${sv})`; }
    $("baieC").style.transform = `translateX(${(-172 * a[4]).toFixed(1)}px)`;
    const sy = (1 - 0.8 * a[5]).toFixed(3);
    lames.forEach((l) => (l.style.transform = `scaleY(${sy})`));
    $("porte").style.transform = `scaleX(${1 - 0.72 * a[6]}) skewY(${6 * a[6]}deg)`;
    $("garage").style.transform = `translateY(${(-186 * a[7]).toFixed(1)}px)`;
    $("portail").style.transform = `translateX(${(-322 * a[8]).toFixed(1)}px)`;
  }
  function tic(now){
    let encore = false;
    if (arrivee) {
      const t = DUREE ? cl((now - t0) / DUREE) : 1;
      cam = melange(depart, arrivee, ease(t));
      if (t >= 1) { cam = arrivee; arrivee = null; } else encore = true;
      poser(cam);
    }
    for (let k = 1; k <= NB; k++) {
      const cible = !arrivee && (etape === k || (k === 1 && etape === 2)) ? 1 : 0;
      let v = anim[k];
      if (reduit) v = cible;
      else { v += (cible - v) * (cible ? 0.07 : 0.12); if (Math.abs(cible - v) < 0.003) v = cible; else encore = true; }
      anim[k] = v;
    }
    appliquer();
    if (encore) requestAnimationFrame(tic); else boucle = false;
  }
  function relancer(){ if (!boucle) { boucle = true; requestAnimationFrame(tic); } }

  function remplir(k){
    const s = S[k];
    $("cNum").textContent = `${k} / ${NB}`;
    $("cTitre").textContent = s.titre;
    $("cTexte").textContent = s.texte;
    $("cTags").innerHTML = s.tags.map((t) => `<li>${t}</li>`).join("");
    $("cLien").href = s.url;
    $("cLien").textContent = `${s.lien || "Voir les " + s.titre.toLowerCase()} →`;
    $("cVar").hidden = !s.variantes;
    $("vPrec").disabled = k === 1;
    $("vSuiv").textContent = k === NB ? "Terminer" : "Suivant →";
  }
  function aller(k, focus){
    const avant = etape;
    etape = k;
    depart = cam; arrivee = cadre(k); t0 = performance.now();
    section.classList.toggle("en-visite", k > 0);
    boutons.forEach((b, j) => b.setAttribute("aria-pressed", String(j + 1 === k)));
    if (k > 0) {
      if (avant > 0 && carte.classList.contains("on")) {
        carte.classList.remove("on");
        setTimeout(() => { if (etape === k) { remplir(k); carte.classList.add("on"); } }, 220);
      } else { remplir(k); carte.classList.add("on"); }
      if (focus) setTimeout(() => $("cTitre").focus({ preventScroll: true }), 50);
    } else {
      carte.classList.remove("on");
      if (focus && avant) boutons[avant - 1].focus({ preventScroll: true });
    }
    relancer();
  }

  $("vPrec").addEventListener("click", () => etape > 1 && aller(etape - 1));
  $("vSuiv").addEventListener("click", () => (etape < NB ? aller(etape + 1) : aller(0, true)));
  $("vFermer").addEventListener("click", () => aller(0, true));
  document.addEventListener("keydown", (e) => {
    if (!etape) return;
    if (e.key === "Escape") aller(0, true);
    else if (e.key === "ArrowRight" && etape < NB) aller(etape + 1);
    else if (e.key === "ArrowLeft" && etape > 1) aller(etape - 1);
  });
  const varBtns = Array.from(document.querySelectorAll("#cVar button"));
  varBtns.forEach((btn) => btn.addEventListener("click", () => {
    mode = btn.dataset.v;
    varBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
    const b = mode === "battant";
    $("battants").style.display = b ? "" : "none";
    $("coffre").style.display = b ? "none" : "";
    $("tablier").style.transform = "translateY(-158px)";
    anim[3] = 0; relancer();
  }));
  addEventListener("resize", () => { cam = cadre(etape); arrivee = null; poser(cam); });
  cam = cadre(0); poser(cam); appliquer();
})();
