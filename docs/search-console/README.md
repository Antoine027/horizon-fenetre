# Exports Google Search Console

La tâche de publication du blog lit ce dossier pour optimiser les articles.

## Déposer un export (1 minute, idéalement chaque lundi)

1. Google Search Console → propriété horizonfenetre.com → **Performances** → **Résultats de recherche**, période **3 derniers mois**.
2. **Exporter** → **Télécharger au format CSV**. On obtient un fichier zip.
3. Décompresser et garder au moins `Requêtes.csv` et `Pages.csv`.
4. Sur GitHub (dépôt Antoine027/horizon-fenetre), ouvrir ce dossier `docs/search-console/` → **Add file** → **Upload files**, déposer les deux fichiers en les renommant `AAAA-MM-JJ-requetes.csv` et `AAAA-MM-JJ-pages.csv` (date de l'export) → **Commit changes**.

La tâche utilise toujours l'export le plus récent. Au-delà de 21 jours sans nouvel export, elle continue de publier mais n'optimise plus et le signale.
