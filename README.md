# Horizon Fenêtre — site vitrine

Site statique généré par `build.mjs` (Node, sans dépendance).

- `src/produits.mjs` : textes des pages produits
- `content/blog/*.md` : articles du blog (en-tête + Markdown). Ajouter un fichier = nouvel article.
- `src/style.css` : styles
- `build.mjs` : génération, maillage interne automatique (`CIBLES`), données structurées, sitemap

```
node build.mjs   # génère dist/
```

Vercel construit le site à chaque push sur `main` (voir `vercel.json`).
