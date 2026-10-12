
(function(){
  const BASE = "";
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
      tags:["Coulissant","Motorisable","Clôture assortie"] },
    { r:[880,640,1520,700], hero:1 }
  ];
  const N = S.length - 1;
  document.getElementById("visite").classList.add("anime");
  const svg = document.getElementById("maison");
  const $ = (id) => document.getElementById(id);
  const section = $("visite"), carte = $("carte"), intro = $("vintro"), fin = $("vfin"), voile = $("voile");
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lames = Array.from(document.querySelectorAll(".lame"));
  const NS = "http://www.w3.org/2000/svg";

  // Points de repère et rail de navigation
  const points = $("points"), rail = $("rail");
  S.forEach((s, k) => {
    if (!s.titre) return;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "v-point");
    g.innerHTML = `<circle class="v-halo" cx="${s.p[0]}" cy="${s.p[1]}" r="14" fill="#c9a14a"/><circle cx="${s.p[0]}" cy="${s.p[1]}" r="9" fill="#c9a14a" stroke="#fff" stroke-width="3"/>`;
    g.addEventListener("click", () => aller(k));
    points.appendChild(g);
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" aria-label="${s.titre}"><span>${s.titre}</span><i></i></button>`;
    li.firstChild.addEventListener("click", () => aller(k));
    rail.appendChild(li);
  });
  const boutons = Array.from(rail.querySelectorAll("button"));

  function course(){ return section.offsetHeight - innerHeight; }
  function aller(k){
    const y = section.offsetTop + (k / N) * course() + 2;
    scrollTo({ top: y, behavior: reduit ? "auto" : "smooth" });
  }

  const cl = (v) => Math.max(0, Math.min(1, v));
  const lisse = (t) => t * t * (3 - 2 * t);

  function cadre(s, aspect, mobile){
    let [cx, cy, rw, rh] = s.r;
    if (mobile && s.hero) { rw = 1150; rh = 420; }
    const w = Math.max(rw, rh * aspect);
    let ox, oy;
    if (mobile) { ox = 0; oy = s.hero ? -0.27 : 0.2; }
    else { ox = s.hero ? -0.17 : -0.19; oy = 0.02; }
    return { cx, cy, w, ox, oy };
  }

  let cible = 0, courant = 0, actif = -2, mode = "roulant";
  const varBtns = Array.from(document.querySelectorAll("#cVar button"));
  varBtns.forEach((btn) => btn.addEventListener("click", () => {
    mode = btn.dataset.v;
    varBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
    const b = mode === "battant";
    $("battants").style.display = b ? "" : "none";
    $("coffre").style.display = b ? "none" : "";
    $("tablier").style.transform = "translateY(-158px)";
    if (b) { // rejoue la fermeture des battants
      const t0 = performance.now();
      const anime = (t) => { const a = lisse(cl((t - t0) / 900)); const sv = -0.35 + 1.35 * a; $("vbG").style.transform = $("vbD").style.transform = `scaleX(${sv.toFixed(3)})`; if (a < 1) requestAnimationFrame(anime); };
      requestAnimationFrame(anime);
    } else rendre(courant);
  }));

  function afficherCarte(k){
    if (k === actif) return;
    actif = k;
    if (k < 1 || !S[k] || !S[k].titre) { carte.classList.remove("on"); return; }
    const s = S[k];
    const remplir = () => {
      $("cNum").textContent = `${k} / ${N - 1}`;
      $("cTitre").textContent = s.titre;
      $("cTexte").textContent = s.texte;
      $("cTags").innerHTML = s.tags.map((t) => `<li>${t}</li>`).join("");
      $("cLien").href = BASE + s.url;
      $("cLien").textContent = `${s.lien || "Voir les " + s.titre.toLowerCase()} →`;
      $("cVar").hidden = !s.variantes;
      carte.classList.add("on");
    };
    if (carte.classList.contains("on")) { carte.classList.remove("on"); setTimeout(() => { if (actif === k) remplir(); }, 220); }
    else remplir();
  }

  function rendre(pos){
    const aspect = innerWidth / innerHeight, mobile = innerWidth <= 820;
    let i = Math.min(Math.floor(pos), N - 1), f = pos - i;
    if (pos >= N) { i = N - 1; f = 1; }
    const t = lisse(cl((f - 0.42) / 0.58));
    const a = cadre(S[i], aspect, mobile), b = cadre(S[i + 1], aspect, mobile);
    const w = a.w * Math.pow(b.w / a.w, t), h = w / aspect;
    const cx = a.cx + (b.cx - a.cx) * t, cy = a.cy + (b.cy - a.cy) * t;
    const ox = a.ox + (b.ox - a.ox) * t, oy = a.oy + (b.oy - a.oy) * t;
    svg.setAttribute("viewBox", `${(cx - w / 2 + ox * w).toFixed(1)} ${(cy - h / 2 + oy * h).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);

    // Animation de chaque menuiserie à l'arrivée de la caméra
    const an = (k) => cl((pos - (k - 0.2)) / 0.45);
    const a1 = lisse(an(1)), am = lisse(an(2)), a2 = lisse(an(3)), a3 = lisse(an(4)), a4 = lisse(an(5)), a5 = lisse(an(6)), a6 = lisse(an(7)), a7 = lisse(an(8));
    $("moustiq").style.transform = `translateY(${(-142 + 142 * am).toFixed(1)}px)`;
    $("fenG").style.transform = `scaleX(${1 - 0.7 * a1}) skewY(${7 * a1}deg)`;
    $("fenD").style.transform = `scaleX(${1 - 0.7 * a1}) skewY(${-7 * a1}deg)`;
    if (mode === "roulant") $("tablier").style.transform = `translateY(${(-158 + 158 * 0.78 * a2).toFixed(1)}px)`;
    else { const sv = -0.35 + 1.35 * a2; $("vbG").style.transform = `scaleX(${sv.toFixed(3)})`; $("vbD").style.transform = `scaleX(${sv.toFixed(3)})`; }
    $("baieC").style.transform = `translateX(${(-172 * a3).toFixed(1)}px)`;
    const sy = 1 - 0.8 * a4;
    lames.forEach((l) => (l.style.transform = `scaleY(${sy.toFixed(3)})`));
    $("porte").style.transform = `scaleX(${1 - 0.72 * a5}) skewY(${6 * a5}deg)`;
    $("garage").style.transform = `translateY(${(-186 * a6).toFixed(1)}px)`;
    $("portail").style.transform = `translateX(${(-322 * a7).toFixed(1)}px)`;

    // Textes
    const oIntro = 1 - cl(pos / 0.35), oFin = cl((pos - (N - 0.3)) / 0.3);
    intro.style.opacity = oIntro; intro.style.visibility = oIntro > 0.01 ? "visible" : "hidden";
    fin.style.opacity = oFin; fin.style.visibility = oFin > 0.01 ? "visible" : "hidden";
    voile.style.opacity = Math.max(oIntro, oFin);
    points.style.opacity = Math.max(1 - cl(pos / 0.3), oFin);
    points.style.pointerEvents = (pos < 0.3 || pos > N - 0.3) ? "auto" : "none";
    const d = cl((pos - (N - 0.7)) / 0.7);
    $("crepuscule").setAttribute("opacity", (0.2 * d).toFixed(3));
    $("lumieres").setAttribute("opacity", d.toFixed(3));

    let k = -1;
    if (f < 0.5) k = i; else if (f > 0.93) k = i + 1;
    if (pos >= N - 0.05) k = N;
    afficherCarte(k);
    const etape = Math.round(pos);
    boutons.forEach((btn, j) => btn.classList.toggle("on", j + 1 === etape));
  }

  function mesurer(){
    const c = course();
    const y = -section.getBoundingClientRect().top;
    cible = c > 0 ? cl(y / c) * N : 0;
  }
  let boucle = false;
  function tic(){
    const ecart = cible - courant;
    if (reduit || Math.abs(ecart) < 0.0008) courant = cible; else courant += ecart * 0.16;
    rendre(courant);
    if (courant !== cible) requestAnimationFrame(tic); else boucle = false;
  }
  function demander(){ mesurer(); if (!boucle) { boucle = true; requestAnimationFrame(tic); } }
  addEventListener("scroll", demander, { passive: true });
  addEventListener("resize", () => { mesurer(); rendre(courant); });
  mesurer(); courant = cible; rendre(courant);
})();
