// Dessins techniques en élévation, un par famille de produits (trait, couleur héritée).
const s = (inner, label) =>
  `<svg class="dessin" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" role="img" aria-label="${label}">${inner}</svg>`;

export const dessins = {
  fenetres: s(
    `<rect x="22" y="8" width="76" height="104"/><rect x="28" y="14" width="30" height="92"/><rect x="62" y="14" width="30" height="92"/>
     <path d="M33 20 44 31M33 28 39 34M67 20 78 31M67 28 73 34"/><path d="M58 56v10" stroke-width="4"/><path d="M14 112h92"/>`,
    "Dessin d'une fenêtre deux vantaux"),
  volets: s(
    `<rect x="16" y="8" width="88" height="18" rx="2"/><path d="M22 26v86M98 26v86"/>
     <path d="M22 34h76M22 42h76M22 50h76M22 58h76M22 66h76M22 74h76"/><path d="M22 80h76" stroke-width="3.4"/>
     <path d="M30 86h60v26H30zM60 86v26"/><path d="M10 112h100"/>`,
    "Dessin d'un volet roulant à moitié descendu"),
  "portes-de-garage": s(
    `<path d="M8 40 60 10l52 30"/><path d="M16 36v76M104 36v76"/><rect x="24" y="48" width="72" height="64"/>
     <path d="M24 64h72M24 80h72M24 96h72"/><path d="M34 56h10M76 56h10"/><path d="M4 112h112"/>`,
    "Dessin d'une porte de garage sectionnelle"),
  "portes-d-entree": s(
    `<rect x="32" y="6" width="56" height="106"/><rect x="38" y="12" width="44" height="100"/>
     <rect x="47" y="22" width="9" height="64"/><path d="M74 48v28" stroke-width="4"/><path d="M20 112h80"/>`,
    "Dessin d'une porte d'entrée vitrée"),
  "portails-clotures": s(
    `<rect x="6" y="30" width="12" height="82"/><rect x="102" y="30" width="12" height="82"/>
     <path d="M18 44q21-10 42-4 21-6 42 4M18 106h84M60 40v66"/>
     <path d="M26 42v64M34 41v65M42 40v66M50 40v66M70 40v66M78 40v66M86 41v65M94 42v64"/><path d="M2 112h116"/>`,
    "Dessin d'un portail deux vantaux entre piliers"),
  moustiquaires: s(
    `<rect x="22" y="8" width="76" height="104"/><rect x="29" y="15" width="62" height="90"/>
     <path d="M29 30h62M29 45h62M29 60h62M29 75h62M29 90h62M44 15v90M60 15v90M76 15v90" stroke-width="1"/>
     <path d="M29 15h62v10H29z" fill="currentColor" fill-opacity=".15"/>`,
    "Dessin d'une moustiquaire en cadre"),
  professionnels: s(
    `<rect x="18" y="10" width="84" height="102"/><path d="M18 30h84M18 52h84M18 74h84"/>
     <path d="M28 16h14v8H28zM53 16h14v8H53zM78 16h14v8H78zM28 38h14v8H28zM53 38h14v8H53zM78 38h14v8H78zM28 60h14v8H28zM53 60h14v8H53zM78 60h14v8H78z"/>
     <path d="M50 84h20v28H50z"/><path d="M8 112h104"/>`,
    "Dessin d'un petit immeuble"),
};

// Silhouette de l'horizon lyonnais vu depuis l'est : colline de Fourvière, basilique, tour métallique, tour Part-Dieu.
export const ville = `<svg class="ville" viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true" fill="currentColor">
<path d="M0 140V96c18-6 34-14 52-22 14-6 26-9 38-9 6 0 10 1 14 2V58h4v-6h2v-8h3v8h2v6h4v4h20v-6h4v-7h3v7h4v6h4V44h2V22h2v-6h1v6h2v22h2v24c14 2 26 6 38 12 10 4 18 8 26 10h12V86h10v4h8V70h6v-4h18v4h6v26h10V60l3-3 3-6 3-5h1l3 5 3 6 3 3v38h10V82h14v4h10v-8h16v20h12V92h12v6h14v42z"/>
<path d="M0 140v-18h400v18z" opacity=".6"/>
</svg>`;
