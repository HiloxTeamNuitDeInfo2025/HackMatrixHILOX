# 🛡️ Défi AEDI : La Faille la Plus Maligne

## Thème : Cyber-sécurité - XSS Stockée (Stored Cross-Site Scripting)

### 🎯 La Faille Choisie : Stored XSS (XSS Stockée)

Nous avons choisi de mettre en avant la **Stored XSS** car c'est l'une des failles les plus "malignes" et dangereuses du web. Contrairement à une XSS réfléchie qui ne touche que la victime qui clique sur un lien piégé, la XSS stockée **piège l'application elle-même**.

**Pourquoi est-elle maligne ?**
Elle est **persistante**. Le code malveillant est injecté une seule fois dans la base de données (par exemple dans un commentaire), et il s'exécutera ensuite **automatiquement** sur le navigateur de **tous les utilisateurs** qui consulteront la page infectée, sans qu'ils n'aient rien à faire. C'est une mine antipersonnel numérique.

---

### 🕹️ Comment la reproduire sur le site

Le projet contient un simulateur de failles. Voici comment reproduire la Stored XSS dans notre **Level 3** :

1.  Accédez à l'application (http://localhost:3001).
2.  Connectez-vous (ou utilisez le mode DEMO).
3.  Avancez jusqu'au **LEVEL 3: STORED XSS**.
4.  Vous verrez un livre d'or (Guestbook) où vous pouvez laisser des commentaires.
5.  **L'attaque** : Au lieu d'un message gentil, injectez ce payload JavaScript :
    ```html
    <script>
      alert("HACKED!");
    </script>
    ```
    ou pour être plus discret et voler des cookies (simulé) :
    ```html
    <img src=x onerror=alert('Cookie_Volé:'+document.cookie)>
    ```
6.  Cliquez sur "Post Comment".
7.  **Résultat** : Le commentaire est sauvegardé. Immédiatement, le script s'exécute. Si un autre utilisateur (simulé) visitait cette page, il serait infecté instantanément.

---

### 🛡️ Comment s'en protéger ?

La protection contre les XSS repose sur un principe clé : **Ne jamais faire confiance aux données utilisateur**.

#### 1. Échappement (Escaping) - La méthode principale

Il faut transformer les caractères spéciaux en entités HTML inoffensives avant de les afficher.

- `<` devient `&lt;`
- `>` devient `&gt;`
- `"` devient `&quot;`

**Exemple de correction (React le fait par défaut, sauf si on force le contraire) :**

❌ **Code Vulnérable (utilisé dans notre démo) :**

```jsx
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

✅ **Code Sécurisé :**

```jsx
<div>{userComment}</div>
```

React échappe automatiquement les variables affichées entre `{}`.

#### 2. Content Security Policy (CSP) - La ceinture de sécurité

CSP est un en-tête HTTP qui permet de dire au navigateur quelles sources de scripts sont autorisées. Même si une faille XSS existe, CSP peut empêcher l'exécution du script malveillant.

**Exemple d'en-tête CSP robuste :**

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-scripts.com; object-src 'none';
```

Cela interdit les scripts inline (`<script>...`) et les scripts venant de domaines inconnus.

#### 3. Sanitization (Nettoyage)

Si vous _devez_ autoriser du HTML (ex: éditeur de texte riche), utilisez une librairie de nettoyage robuste comme **DOMPurify** qui va supprimer les balises dangereuses (`<script>`, `<iframe>`, `onerror`, etc.) tout en gardant le formatage (`<b>`, `<i>`).

```javascript
import DOMPurify from "dompurify";
const cleanHTML = DOMPurify.sanitize(dirtyHTML);
```

---

### 🎓 Conclusion

Ce projet "XSS Battle Arena" a été conçu pour **gamifier** l'apprentissage de ces failles. En permettant aux développeurs de _voir_ et _exécuter_ la faille dans un environnement contrôlé (sandbox), ils comprennent mieux l'impact dévastateur d'une simple ligne de code non échappée.

**Équipe Hilox - Nuit de l'Info 2025**
