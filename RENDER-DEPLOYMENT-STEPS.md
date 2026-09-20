# 🚀 Déployer sur Render - Guide Étape par Étape

## ✅ Étape 1: Connexion GitHub (TU ES ICI)

Tu vois la page de connexion GitHub. 

**Remplis:**
1. Username or email address: `ton-github-username`
2. Password: `ton-github-password`
3. Clique **Sign in**

---

## Étape 2: Autoriser Render

GitHub te demandera d'autoriser Render à accéder à tes repos.

Clique **Authorize render-oss** ✅

---

## Étape 3: Créer le Web Service

Après connexion, tu verras le dashboard Render.

Clique **"New +"** → **"Web Service"**

---

## Étape 4: Sélectionner le Repository

Tu verras une liste de tes repos GitHub.

Trouve: **`vehicle-auctions`**

Clique pour le sélectionner.

---

## Étape 5: Configurer le Service

**Remplis ces champs exactement:**

| Champ | Valeur |
|-------|--------|
| **Name** | `vehicle-auctions-mvp` |
| **Root Directory** | (laisser vide) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Branch** | `main` |

---

## Étape 6: Variables d'Environnement (IMPORTANT!)

Avant de cliquer "Deploy", clique **"Advanced"**

Clique **"Add Environment Variable"** et ajoute ces 4 variables:

### Variable 1:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: [Copier depuis https://app.supabase.com/project/xxx/settings/api]
```

### Variable 2:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Copier depuis Supabase Settings → API → anon public]
```

### Variable 3:
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: [Copier depuis Supabase Settings → API → service_role]
```

### Variable 4:
```
Key: NODE_ENV
Value: production
```

---

## 🎯 Étape 7: DEPLOY!

Clique le gros bouton **"Create Web Service"** ou **"Deploy"**

---

## ⏳ Après le Déploiement

Render va:
1. ✅ Cloner ton repo
2. ✅ Installer les dépendances (`npm install`)
3. ✅ Builder (`npm run build`) - prend 2-3 min
4. ✅ Lancer le serveur (`npm run start`)
5. ✅ Te donner une URL publique

Tu verras une URL comme: **`https://vehicle-auctions-mvp.onrender.com`**

---

## 🎉 URL FINALE

Accède à ton MVP à:

```
https://vehicle-auctions-mvp.onrender.com/mvp
```

---

## ✨ Auto-Redéploiement

À partir de maintenant, à chaque fois que tu pousses vers `main` sur GitHub:

1. Render détecte le push
2. Render rebuildeth le projet
3. Nouveau déploiement automatique! 🔄

---

## 🆘 Si quelque chose échoue

### Erreur: "Build failed"

Clique sur l'onglet **"Logs"** pour voir l'erreur.

Erreurs courantes:
- **TypeScript error** → Vérifier `npm run build` localement
- **Missing env vars** → Vérifier toutes les 4 variables sont ajoutées
- **Node version** → Render utilise Node 18+ (OK)

### Page retourne 404

- Attendre 30 secondes supplémentaires (le build peut être en cours)
- Aller à `/mvp` pas juste `/`
- Vérifier les logs

### Variables d'env pas chargées

- Vérifier qu'elles sont exactement nommées
- Pas d'espaces supplémentaires
- Pas de `$` ou `=` supplémentaires

---

## 📝 Résumé Rapide

1. GitHub login → **Autoriser Render**
2. New Web Service → **Sélectionner vehicle-auctions**
3. Config:
   - Build: `npm install && npm run build`
   - Start: `npm run start`
   - Runtime: `Node`
4. Advanced → Ajouter 4 variables d'env
5. Click **Deploy** ✅
6. Attendre 3-5 min
7. Accéder à `/mvp` 🎉

---

**Total Time: 5-10 minutes!**

**Tu auras un MVP en production accessible au monde entier! 🚀**
