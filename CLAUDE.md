# Site Horizon Fenêtre

Site statique de Horizon Fenêtre (marque d'ESCOM HABITAT, Rillieux-la-Pape). Générateur Node sans dépendance : `node build.mjs` produit `dist/`. Déployé par Vercel à chaque push sur `main` (dépôt GitHub Antoine027/horizon-fenetre).

## Modèle commercial (à respecter dans tous les textes)
- Horizon Fenêtre vend la **fourniture seule**, facturée avec une **TVA à 20 %**.
- Antoine (Horizon Fenêtre) fait la **visite et la prise de cotes**.
- La **pose** est réalisée par un **installateur partenaire**, jamais nommé. Il est assuré en **garantie décennale** (confirmé par Antoine le 21/10/2026) : la mention « pose avec décennale » est donc juste. Antoine remet au client son devis de fourniture et le devis de pose de l'installateur partenaire (deux devis distincts) ; la mention « Devis de fourniture et pose » de la page d'accueil est validée par Antoine, ne pas la modifier.
- Ne jamais écrire « nous posons », ne jamais inventer de chantier, client, avis, certification (RGE…), garantie ou année d'expérience.
- Ne citer aucun nom de fournisseur, sauf Somfy (consigne d'Antoine du 19/11/2026) : écrire « un fabricant français ». Exception déjà accordée : Picard Serrures sur la page Porte blindée.
- Téléphone 04 28 55 00 24, e-mail contact@horizonfenetre.com. Zone : Lyon, métropole, Côtière, Dombes, Val de Saône.

## Blog
- Articles : `content/blog/<slug>.md`, avec un en-tête :
  `title` (≤ 60 caractères), `h1`, `description` (≤ 160), `photo` (clé de `src/photos.mjs`), `rubrique` (Fenêtres, Volets, Baies vitrées, Portes d'entrée, Portes de garage, Portails et clôtures, Moustiquaires, Aides et réglementation), `date` (AAAA-MM-JJ), `motcle`, `resume`, `sources` (`libellé|url ; libellé|url`).
- Corps en markdown simple : `##` pour les intertitres, listes, tableaux, `> Bon à savoir : …`, liens `[texte](url)`.
- Le maillage interne automatique est dans `CIBLES` (build.mjs). Les liens manuels vers les pages produits restent utiles.
- Plan de publication : `docs/plan-editorial.md`.
- Style : français naturel, phrases courtes, ton d'artisan qui explique, pas de formules creuses ni de bourrage de mots-clés.

## Publication (consigne d'Antoine du 18/11/2026)
- Exception (consigne d'Antoine du 20/11/2026) : les articles de blog et leurs optimisations Search Console, faits par la tâche programmée du mardi et du vendredi, se publient toujours automatiquement (commit et push sur `main` sans attendre de « publie »).
- Pour tout le reste, par défaut, ne rien publier : ne jamais pousser sur `main` (ni sur une autre branche, qui créerait un aperçu Vercel) sans un « publie » explicite d'Antoine.
- Travailler sur une branche locale et lui montrer des aperçus.
- À chaque réponse, lui reproposer de publier et lui dire combien de modifications attendent la publication (`git log origin/main..HEAD --oneline`).

## Vérifier avant de pousser
`node build.mjs` doit afficher « OK : … pages indexables », sans erreur. Le fichier `src/dates.json` se met à jour tout seul : le committer avec l'article.
