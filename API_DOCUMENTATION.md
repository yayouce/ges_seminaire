# Documentation API - Gestion de Séminaire

## Vue d'ensemble

Cette API permet de gérer un système de séminaires avec des séminaristes, des membres de commission et des superadmins.

**URL Swagger**: `http://localhost:3005/swager/api`
**JSON Swagger**: `http://localhost:3005/swager/json`

---

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. La plupart des endpoints nécessitent un token Bearer.

### Routes disponibles

#### `POST /auth/signIn` - Connexion des membres de commission
Permet aux membres de commission de se connecter.

**Body**:
```json
{
  "phonePers": "+221701234567",
  "motPass": "password123"
}
```

**Réponse (200)**:
```json
{
  "user": {
    "idpers": "uuid",
    "phonePers": "+221701234567",
    "rolePers": "Accueil",
    "roleMembre": "RESP"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### `POST /auth/signIn/superadmin` - Connexion des superadmins
Permet aux superadmins de se connecter. **Les superadmins ont tous les droits dans le système.**

**Body**:
```json
{
  "loginSupAdmin": "admin",
  "motPassSupAdmin": "password123"
}
```

**Réponse (200)**:
```json
{
  "user": {
    "loginSupAdmin": "admin",
    "idSupAdmin": "uuid",
    "role": "SUPERADMIN"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### `GET /auth/getuser` - Récupérer tous les utilisateurs
Retourne la liste de toutes les personnes enregistrées.

**Réponse (200)**: Liste des utilisateurs

---

## Superadmin

### Routes disponibles

#### `POST /superadmin` - Créer un nouveau superadmin
Crée un nouveau compte superadmin.

**Body**:
```json
{
  "loginSupAdmin": "admin",
  "motPassSupAdmin": "password123"
}
```

**Réponse (201)**:
```json
{
  "idSupAdmin": "uuid",
  "loginSupAdmin": "admin",
  "motPassSupAdmin": "$2b$10$hashed_password..."
}
```

---

## Séminaristes

### Gestion du matricule
Le matricule est automatiquement formaté au format `IKH-XXXX`:
- **Exemple**: `20` → `IKH-0020`
- **Exemple**: `300` → `IKH-0300`
- Le matricule est la **clé primaire** et doit être unique

### Vérification de duplication
Le système vérifie qu'aucun séminariste avec:
- Le même matricule
- Le même nom, prénom ET téléphone

n'existe déjà dans la base de données.

### Gestion de la catégorie
La catégorie (`Pepinieres`, `Enfants`, `Jeunes_et_adultes`) est **définie par le front-end**. Il n'y a plus de calcul automatique basé sur l'âge.

### Permissions
- **Création**: Commission Accueil + Superadmins
- **Modification**: Commissions Accueil, Administration, Formation + Superadmins
- **Suppression**: Commissions Accueil, Administration, Formation + Superadmins
- **Lecture**: Tous

### Routes disponibles

#### `POST /seminariste/add` - Créer un séminariste
🔒 **Authentification requise** (Commission Accueil ou Superadmin)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "matricule": "20",
  "nomSemi": "Diarra",
  "prenomSemi": "Yaya",
  "categorie": "Jeunes_et_adultes",
  "genreSemi": "frere",
  "phoneSemi": "+221701234567",
  "age": 25,
  "sousComite": "Comité A",
  "numUrgence": "+221771234567",
  "dortoir": "uuid-dortoir",
  "membreCo": "uuid-membre",
  "niveau": "uuid-niveau",
  "etatSante": "Bon",
  "problemeSante": "Ras",
  "nomNiveau": "Niveau 1"
}
```

**Codes d'erreur**:
- `701`: Accès refusé (permissions insuffisantes)
- `702`: Dortoir non trouvé
- `703`: Le genre ne correspond pas au dortoir
- `709`: Un séminariste avec ce matricule existe déjà
- `710`: Cette personne est déjà enregistrée

---

#### `GET /seminariste/listeSeminariste` - Liste de tous les séminaristes
Retourne tous les séminaristes enregistrés.

**Réponse (200)**: Array de séminaristes

---

#### `GET /seminariste/getone/:id` - Récupérer un séminariste
🔒 **Authentification requise**

**Paramètre**:
- `id`: ID du séminariste

**Réponse (200)**: Détails du séminariste avec relations (dortoir, niveau, membre CO)

**Codes d'erreur**:
- `706`: Séminariste non trouvé

---

#### `PATCH /seminariste/update/:id` - Modifier un séminariste
🔒 **Authentification requise** (Commissions Accueil, Administration, Formation ou Superadmin)

**Paramètre**:
- `id`: ID du séminariste

**Body**: Mêmes champs que la création (tous optionnels)

**Codes d'erreur**:
- `701`: Accès refusé
- `705`: Séminariste non trouvé

---

#### `DELETE /seminariste/delete/:id` - Supprimer un séminariste
🔒 **Authentification requise** (Commissions Accueil, Administration, Formation ou Superadmin)

**Note**: Effectue une suppression logique (soft delete)

**Paramètre**:
- `id`: ID du séminariste

**Codes d'erreur**:
- `701`: Accès refusé
- `706`: Séminariste non trouvé

---

## Statistiques

### Routes disponibles

#### `GET /seminariste/totalByGender` - Statistiques par genre
Retourne le nombre de séminaristes par genre.

**Réponse (200)**:
```json
{
  "frere": 150,
  "soeur": 120,
  "non_defini": 0,
  "Total": 270
}
```

---

#### `GET /seminariste/totalByCateg` - Statistiques par catégorie
Retourne le nombre de séminaristes par catégorie avec distinction par genre.

**Réponse (200)**:
```json
{
  "Pepinieres": {
    "totalFrere": 20,
    "totalSoeur": 18
  },
  "Enfants": {
    "totalFrere": 45,
    "totalSoeur": 40
  },
  "Jeunes_et_Adultes": {
    "totalFrere": 85,
    "totalSoeur": 62
  }
}
```

---

## Enums & Types

### Genres
- `frere`
- `soeur`
- `non_defini`

### Catégories de séminaristes
- `Pepinieres`
- `Enfants`
- `Jeunes_et_adultes`
- `Non_specifie`

### États de santé
- `Bon`
- `Malade`
- `Autres`
- `Non_specifie`

### Commissions
- `Accueil`
- `Administration`
- `Formation`
- `Pco`
- (autres selon la configuration)

### Rôles de membres
- `RESP` (Responsable)
- `MEMBRE`

---

## Notes importantes

### Superadmins
Les superadmins:
- Peuvent se connecter via `/auth/signIn/superadmin`
- Ont **tous les droits** sur toutes les ressources
- Peuvent effectuer toutes les opérations CRUD
- Contournent toutes les vérifications de permissions basées sur `rolePers` et `roleMembre`

### Sécurité
- Tous les mots de passe sont hashés avec bcrypt (10 salt rounds)
- Les tokens JWT expirent selon la configuration
- Utilisez HTTPS en production
- Gardez votre `JWTSECRET` confidentiel

### Format de matricule
Le système accepte n'importe quel nombre et le formate automatiquement:
- `1` → `IKH-0001`
- `99` → `IKH-0099`
- `1234` → `IKH-1234`

Le format attendu du front-end peut être n'importe quel nombre (avec ou sans zéros initiaux).
