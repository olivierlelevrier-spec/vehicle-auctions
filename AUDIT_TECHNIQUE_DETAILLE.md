# AUDIT TECHNIQUE DÉTAILLÉ - 2026-09-20

## ÉTAT DU DÉPÔT

- **Branche**: main (à jour avec origin/main)
- **Changements**: Aucun non commité
- **Historique**: Tous les changements sur main (pas de feature branches)

✅ **Repo propre**

---

## VARIABLES D'ENVIRONNEMENT

### .env.local actuel:
```
NEXT_PUBLIC_SUPABASE_URL=https://uxzzvzreostcrigfszcz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9IE8SRooewqMNg1q1L34yw_hbapNnta
SUPABASE_SERVICE_ROLE_KEY=TO_FILL_LATER
```

### Status:
| Variable | Status | Besoin |
|----------|--------|--------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ | Critique |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | Critique |
| SUPABASE_SERVICE_ROLE_KEY | ❌ Placeholder | Critique |

❌ **Client → Supabase: OK. Server → Supabase: BLOQUÉ**

---

## MIGRATIONS SUPABASE & TABLES

### Fichiers SQL en Git:
**ZÉRO fichier de migration SQL trouvé**

### Tables attendues:
```
auth.users (géré par Supabase)
public.profiles (profils publics)
public.listings (annonces)
public.bids (enchères)
```

### Statut: ❓ À VÉRIFIER
- Aucune migration tracée
- Impossible de confirmer sans accès direct Supabase
- Setup script setup-supabase.sh refuse d'exécuter (clé service manquante)

---

## AUTHENTIFICATION

### Fichiers existants:
- lib/supabase-auth.ts: Client-side Supabase Auth ✅
- app/signup/page.tsx: Formulaire signup ✅
- app/login/page.tsx: Formulaire login ⚠️
- app/api/auth/dev-login/route.ts: Dev-only fallback ⚠️

### Problèmes:
1. Dev-only fallback refuse requests en production
2. Pas de table profiles pour utilisateurs publics
3. Pas de session persistence serveur
4. Métadonnées auth seulement (pas de table)

### Verdict: ⚠️ **Partiellement fonctionnel en dev, cassé en prod**

---

## CRÉATION D'ANNONCE

### Fichiers:
- app/sell/page.tsx: Formulaire 10-étapes ✅
- app/api/announcements/route.ts: API POST ✅
- lib/supabase.ts:saveAnnouncement(): Insert code ✅

### Problème CRITIQUE:
Table `announcements` introuvable. Code appelle:
```typescript
supabase.from('announcements').insert(...)
```

Mais table probablement n'existe pas → insertion échoue silencieusement.

### Verdict: ❌ **Impossible à tester sans table**

---

## BROWSE ANNONCES

### Statut localhost:
```
"Aucune annonce trouvée"
```

### Cause: Pas de données (table vide ou inexistante)

### Verdict: ❌ **Pas de données**

---

## PAGE DÉTAIL

### Fichier: app/listings/[id]/page.tsx
### Fetch logic: Absent
### Verdict: ❌ **Non fonctionnel**

---

## ENCHÈRES (BIDDING)

### Implémentation: ZÉRO
- Pas de table bids
- Pas d'API /api/bids
- Pas de logique validation
- Pas de contrôle autorisations

### Verdict: ❌ **N'existe pas**

---

## RLS (ROW LEVEL SECURITY)

### Status: ❓ À VÉRIFIER
Aucun fichier de config RLS. À vérifier directement dans Supabase.

### Nécessaire:
- Lectures publiques autorisées
- Écritures protégées par user_id
- Suppressions seulement par propriétaire

---

## MODULES SECONDAIRES (GELÉS)

Tous GARDÉS EN PLACE, désactivés dans le parcours MVP:

| Module | Statut | Action |
|--------|--------|--------|
| Scanner immatriculation | Histovec mock | Laisser |
| VIN decoder | API créée | Laisser |
| Estimation prix | Heuristique | Laisser |
| Garantie | UI only | Laisser |
| Crédit | UI only | Laisser |
| Dashboard | UI only | Laisser |
| Photos upload | Code existe | Désactiver form |
| Auto1 scraper | Jamais testé | Laisser |

---

## ERREURS REPRODUCTIBLES

### Test 1: Browse (localhost)
```
Résultat: "Aucune annonce trouvée"
Cause: Pas de données
```

### Test 2: Sell Form
```
Résultat: Charge OK, Étape 0
```

### Test 3: Production Warranty
```
URL: https://vehicle-auctions-five.vercel.app/warranty
Résultat: 404 Not Found
```

---

## ACCÈS NÉCESSAIRE (MODE SÉCURISÉ)

### Je n'ai besoin d'AUCUN secret personnel.

### Option A (Recommandée): Collaboration Supabase
- M'ajouter comme collaborateur au projet Supabase
- Je peux: vérifier tables, créer migrations, configurer RLS

### Option B: Appel API temporaire
- Token d'accès Supabase single-use
- Je peux: vérifier les tables

### Option C: Configuration locale
- .env.local.example complet avec placeholders
- M'indiquer quelles variables manquent

### ❌ Je N'ACCEPTERAI JAMAIS:
- Service Role Key en clair
- Mots de passe
- Clés API Stripe
- Identifiants personnels

---

## ESTIMATION PAR BLOC

### Phase 0: Supabase Setup (Bloquant)
- Vérifier tables: 30 min
- Créer tables manquantes: 30 min
- Configurer RLS: 30 min
- **Total: 1-2h**

### Phase 1A: Auth
- Table profiles: 30 min
- Getter/setter: 30 min
- Tests: 1h
- **Total: 2h**

### Phase 1B: Create Listing
- Table listings: 30 min
- Simplifier formulaire: 1h
- Tests: 1h
- **Total: 2-3h**

### Phase 1C: Browse + Détail
- API fetch: 30 min
- Page détail: 1h
- Tests: 30 min
- **Total: 2h**

### Phase 2: Bidding
- Table bids: 30 min
- API bidding: 2h
- RLS: 1h
- Tests: 1h
- **Total: 4-5h**

### Phase 3: Prod Verification
- Deploy: 30 min
- Tests: 2h
- Bugs: 1h
- **Total: 3-4h**

### TOTAL: 14-20 heures = 2-3 jours complets

---

## PREMIER JALON PRODUCTION

### Test en prod (https://vehicle-auctions-five.vercel.app):

Compte A signup → login → create listing → Supabase saved
Compte B signup → login → browse → see listing → click detail → bid 
Compte A → refresh → see bid from Account B
Compte B → refresh → see my bid persistent

**Toutes données RÉELLES, pas de mock**
**Persiste après F5**

---

## CHECKLIST AUDIT

Repo et branches
- [x] Branche main à jour
- [x] Aucun changement non commité
- [ ] Variables d'env complètes

Supabase Setup
- [ ] Tables profiles, listings, bids existent
- [ ] Service Role Key configurée
- [ ] RLS correctement implémentées
- [ ] Auth testée

Authentification
- [ ] Signup fonctionne
- [ ] Login fonctionne
- [ ] Session persiste en prod
- [ ] Profil créé

Listings
- [ ] Créer listing fonctionne
- [ ] Données persistées
- [ ] Browse affiche
- [ ] Détail fonctionne

Bids
- [ ] Table créée
- [ ] Enchérir fonctionne
- [ ] Validation montant
- [ ] Autorisations correctes

Production
- [ ] Deploy réussi
- [ ] Pas de 404
- [ ] 2-comptes scenario OK
- [ ] Persist après F5

---

## CONCLUSION

État: 80% UI, 20% logique fragmentée
Supabase: Incomplète, tables inconnues
Production: Non fonctionnel end-to-end

**Avec accès Supabase: 2-3 jours réalistes**

Timeline:
- Supabase setup: 1-2h
- Auth + Listings: 4-5h
- Bidding + Tests: 6-8h
- Prod verification: 2-4h
