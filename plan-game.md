# AlphaKids — Plan de conception « De zéro à la lecture et au raisonnement »

> Proposition de refonte et d'extension du jeu existant.
> Objectif : un programme ludique, inspiré de la méthode **Montessori** et de la **phonique synthétique**, pour un enfant de **4 à 6 ans** qui part de **zéro (niveau 0)** ou avec **un peu d'anglais à l'oreille (niveau 1)**, et qui apprend à **lire**, **compter**, **calculer** et **raisonner** pour avancer dans son parcours scolaire.

---

## 1. Vision

Un environnement **sans échec**, **auto-correctif**, **hors ligne**, sans publicité ni compte ni suivi, où l'enfant progresse à son rythme en manipulant des objets visuels et sonores. L'application **observe discrètement** comment l'enfant réussit pour deviner ses points forts (calcul / lettres / logique) et lui proposer un parcours **personnalisé**, sans jamais le « tester » de façon visible ni le classer.

Trois piliers :

1. **Lire petit à petit** (Montessori langage + phonique).
2. **Compter et calculer** (Montessori math, concret → abstrait).
3. **Raisonner et résoudre** (logique, séquençage, petit jeu 2D).

---

## 2. Principes pédagogiques

Issus de Montessori et des méthodes de lecture éprouvées :

| Principe | Application concrète |
|---|---|
| **Concret → abstrait** | On manipule des objets/points avant d'écrire les chiffres/lettres ; les symboles arrivent après la manipulation. |
| **Multi-sensoriel** | Chaque notion mobilise l'ouïe (audio), la vue (images) et le geste (glisser, toucher). |
| **Contrôle de l'erreur (auto-correction)** | L'enfant voit tout de suite si c'est juste, sans punition ; l'erreur est une information, pas un échec. |
| **Isolement de la difficulté** | Une seule notion nouvelle à la fois (ex. un seul son nouveau par étape). |
| **Leçon en 3 temps** | « This is… » → « Show me… » → « What is this? » (nommer, montrer, nommer seul). |
| **Maîtrise avant de passer** | On ne monte de niveau qu'après réussite répétée (ex. 3× de suite sans erreur), jamais sur un score brut. |
| **Auto-rythme** | Aucune minuterie de stress ; l'enfant peut réécouter, réessayer, ralentir. |
| **Renforcement positif** | Encouragements vocaux, étoiles, stickers ; jamais de pénalité ni de « game over ». |

**Choix de la phonique synthétique** (décodage lettre → son) plutôt que globale : c'est la plus efficace pour apprendre à lire en anglais, et c'est celle des références citées (§10). L'orthographe anglaise étant irrégulière, on introduit les mots **décodables** d'abord (CVC), puis les irréguliers (« sight words ») au compte-gouttes.

---

## 3. Architecture du programme

Le parcours est découpé en **domaines** (Langage, Math, Logique, Géographie, Madagascar, Résolution) et en **paliers**. Chaque palier = plusieurs activités courtes (l'équivalent des « jeux » actuels), jouables en 3–5 minutes.

### 3.1 Domaine « Langage & Lecture » — du son au texte

Adapté de la progression Montessori des séries **rose / bleue / verte**.

| Paliers | Contenu | Exemples d'activités |
|---|---|---|
| **P0 — Écoute** | Bains de langue, vocabulaire concret | « Écoute et trouve » (déjà présent) : entendre un mot et montrer l'image. |
| **P1 — Sons** | Conscience phonologique : rimes, syllabes, sons initiaux | « Quel mot commence par /b/ ? », « Trouve l'intrus qui ne rime pas ». |
| **P2 — Lettres et sons** | Lettres rugueuses → son de chaque lettre (phonics) | « Touche la lettre qui fait /m/ », tracer la lettre au doigt. |
| **P3 — Série rose (CVC)** | Mots simples à 3 sons : *cat, sun, dog, map, red* | « Assemble c‑a‑t », « Lis le mot et choisis l'image ». |
| **P4 — Série bleue (mélanges)** | Groupes de consonnes : *frog, desk, jump, hand* | Décomposer/recomposer, dictée muette avec alphabet mobile. |
| **P5 — Série verte (phonogrammes)** | *sh, ch, ee, oo, ai, oa…* | « Associe le son /ee/ à *tree, bee, feet* ». |
| **P6 — Mots-outils + phrases** | « Sight words » irréguliers + premières phrases | « Lis et associe la phrase à l'image », « Le mot manquant ». |
| **P7 — Petits livres** | Histoires décodables de 3–5 phrases | « Lis et touche ce qui arrive », compréhension simple. |

**Points clés** :
- On **décode avant d'encoder** n'est pas un absolu Montessori : l'alphabet mobile (encoder) précède souvent la lecture. Ici, l'enfant **construit** les mots (syllabes/sons) **puis** les lit.
- Chaque nouveau son est **isolé** ; on révise toujours les précédents (répétition espacée, §5).
- Les activités « Read Together » et « Build a Word » actuelles deviennent les briques P2–P4, enrichies de sons (phonics) et non plus seulement de syllabes.

### 3.2 Domaine « Numération & Calcul »

Adapté de la progression Montessori (barres numériques, boîtes à fuseaux, perles dorées, bandes d'addition).

| Paliers | Contenu | Exemples d'activités |
|---|---|---|
| **N0 — Sens du nombre 1–10** | Subitizing, comptage, zéro | « Compte et tape » (déjà présent), « Montre 5 doigts/points », « Combien manque-t-il ? ». |
| **N1 — 11–20** | Teen numbers, suites | « Quel nombre vient après ? », « Assemble 10 + 4 ». |
| **N2 — Dizaines → 100** | Comptage par 10, tableau des 100 | « Compte de 10 en 10 » (déjà présent), « Chasse au nombre » (déjà présent). |
| **N3 — Décimales** | Unités/dizaines/centaines avec perles dorées | « Combien de dizaines dans 32 ? ». |
| **N4 — Addition** | + jusqu'à 5, 10, 20 (visuel) | « Addition en images » (déjà présent), barres numériques combinées. |
| **N5 — Soustraction** | Retrait visuel | « Retire et compte ce qui reste » (déjà présent). |
| **N6 — Premières idées × / ÷** | Groupes égaux, partage | « 2 rangées de 3 = ? », « Partage 6 pommes en 2 ». |

**Points clés** :
- La manipulation visuelle (points, barres, perles) **précède** toujours le symbole écrit.
- Le **subitizing** (reconnaître 1–5 sans compter) est un prédicteur fort du futur niveau en math : on le cultive tôt et on le mesure discrètement (§4).

### 3.3 Domaine « Logique & Raisonnement »

Inspiré du **matériel sensoriel** Montessori (tour rose, cylindres, tablettes de couleurs) et des jeux de logique type GCompris.

| Paliers | Contenu | Exemples |
|---|---|---|
| **L0 — Association** | Trier, apparier, classer | « Range du plus petit au plus grand », « Associe chaque bébé à sa maman ». |
| **L1 — Motifs** | Suites simples ABAB, ABC | « Continue le motif 🔴🔵🔴🔵… ». |
| **L2 — Séries & catégories** | Intrus, analogies simples | « Trouve l'intrus », « Qu'est-ce qui va ensemble ? ». |
| **L3 — Mémoire & espace** | Memory, rotation, parcours | « Retrouve la paire », « Quelle forme est tournée ? ». |
| **L4 — Séquence & cause** | Algorithmique douce, ordre d'actions | « Programme le chemin du petit robot » (cf. jeu 2D, §6). |

### 3.4 Domaine « Résolution de problèmes » (jeu 2D)

Voir spécification dédiée au §6.

### 3.5 Domaine « Géographie » (en anglais)

Des notions de base, du plus proche (la Terre) au plus lointain (les pays), en anglais.

| Paliers | Contenu | Exemples d'activités |
|---|---|---|
| **G0 — Notre planète** | La Terre, le globe, terre/mer, jour/nuit | « Montre la Terre », « Où est la mer ? », « C'est le jour ou la nuit ? ». |
| **G1 — Les continents** | Les 7 continents (forme, position, nom anglais) | « Où est l'Afrique ? », « Associe le continent à son nom ». |
| **G2 — Les pays & drapeaux** | Une sélection de pays (France, Royaume-Uni, USA, Japon, Chine, Brésil, Australie, Égypte, Madagascar…) | « Associe le drapeau au pays », « Quel est ce drapeau ? ». |
| **G3 — Les langues** | Langue parlée par pays, salutations | « *Bonjour* se dit en… ? », « Quelle langue parle-t-on ici ? ». |
| **G4 — Jeu « Pays & drapeaux »** | Synthèse : carte simplifiée, drapeaux, langues | « Place le pays sur la carte », « Trouve le drapeau du Japon ». |

**Points clés** :
- On part du **concret** (un globe simplifié, des images de pays), on parle **en anglais** (noms de continents, pays, drapeaux).
- Le jeu de drapeaux/langues est une **association** visuelle + audio : l'enfant entend le nom du pays puis touche le drapeau correspondant.

### 3.6 Programme spécial « Madagascar »

Un module dédié pour découvrir Madagascar (en anglais, avec les noms propres en malgache), du plus simple au plus culturel.

| Paliers | Contenu | Exemples d'activités |
|---|---|---|
| **MG0 — Mon pays** | L'île sur la carte, le drapeau 🇲🇬, la capitale **Antananarivo** | « Où est Madagascar ? », « Associe le drapeau de Madagascar ». |
| **MG1 — Les 6 provinces** | Antananarivo, Antsiranana, Fianarantsoa, Mahajanga, Toamasina, Toliara | « Place la province sur la carte », « Associe la province à sa ville ». |
| **MG2 — Lieux célèbres** | Allée des baobabs (Morondava), Tsingy de Bemaraha, Nosy Be, Ranomafana, Andasibe, Île Sainte-Marie, Isalo… | « Associe l'image au lieu », « Où voit-on les baobabs ? ». |
| **MG3 — Nature** | Lémuriens (maki), caméléons, fossa, baobabs | « Reconnais l'animal », « Associe l'animal à son nom ». |
| **MG4 — Les 18 ethnies** | Merina, Betsileo, Betsimisaraka, Sakalava, Bara, Antandroy, Antanosy, Antaisaka, Tanala, Sihanaka, Tsimihety, Antakarana, Mahafaly, Vezo… | Découverte douce et culturelle : « Où vit ce peuple ? », « Associe la région à son ethnie ». |
| **MG5 — Jeu « Découvre Madagascar »** | Synthèse : carte, provinces, lieux, nature | « Place le lieu sur la carte », « Reconnais le drapeau et la capitale ». |

**Points clés** :
- Présentation **respectueuse et culturelle** (pas de stéréotypes) : les ethnies sont présentées comme des **richesses culturelles**, jamais hiérarchisées.
- **Bilingue malgache/anglais** sur les noms propres (ex. « Antananarivo » / « Tana ») pour valoriser la langue locale.
- Les « 18 ethnies » (les *foko 18*) sont introduites progressivement, en douceur, avec des images de la vie quotidienne et des régions.

---

## 4. Le « Jeu des talents » — test d'intelligence **discret**

L'enfant ne passe **jamais** un « test ». Il joue à une collection de mini-défis (« Les Explorations ») qui sont en réalité des mesures. Les scores sont calculés **en arrière-plan** et ne sont montrés qu'aux parents, sous forme de **pistes** (jamais de QI, jamais de classement).

### 4.1 Les trois axes mesurés

| Axe | Ce qu'on mesure | Signaux observés |
|---|---|---|
| **Calcul (numérique)** | Sens du nombre, subitizing, comparaison, arithmétique | Précision, vitesse de subitizing, besoin d'aide, stratégie (comptage vs reconnaissance directe). |
| **Lettres (langagier)** | Conscience phonologique, vocabulaire, décodage | Discrimination de sons, rimes, correspondance son→lettre, compréhension. |
| **Logique (spatial/séquentiel)** | Motifs, catégories, mémoire, planification | Suite logique, intrus, rotation, ordre d'actions, nombre d'essais. |

### 4.2 Comment c'est « discret »

- Les défis sont présentés comme des **jeux amusants** (animaux, couleurs, histoires), jamais comme un examen.
- Aucun score visible, aucun chronomètre anxiogène (on mesure le **temps de réponse** en interne, sans l'afficher).
- Pas de « mauvais résultat » : chaque session se termine par une récompense.
- La mesure est **répétée** sur plusieurs sessions pour être fiable (un enfant de 4 ans est variable).

### 4.3 Ce qu'on en fait

1. **Profil à 3 barres** (calcul / lettres / logique), visible uniquement dans la Zone Parents.
2. **Parcours personnalisé** : l'enfant reçoit davantage d'activités dans son domaine fort (pour l'encourager) **tout en** renforçant doucement les autres (développement équilibré). Ex. : un enfant « logique » aura plus de jeux de motifs et de parcours, avec un fil rouge de lecture intégré.
3. **Re-évaluation périodique** (toutes les 2–3 semaines d'usage) : le profil d'un 4–6 ans évolue vite ; on ajuste le parcours en continu.
4. **Recommandations parents** : des suggestions concrètes (« votre enfant aime associer ; proposez des puzzles, des jeux de construction »).

### 4.4 Éthique

- Le profil est présenté comme des **préférences/points forts**, pas comme une mesure d'intelligence figée.
- Aucune donnée ne quitte l'appareil (cohérent avec la promesse actuelle).
- Les parents peuvent **désactiver** le profiling et repasser en parcours libre.

---

## 5. Moteur d'adaptation & progression

- **Niveaux explicites** : chaque domaine a des paliers (P0…P7, N0…N6, L0…L4). L'enfant part du niveau 0 (ou 1 s'il maîtrise déjà l'écoute, détecté en début de parcours).
- **Maîtrise** : un palier est validé après *n* réussites consécutives sans erreur (ex. 3), pas sur un score.
- **Répétition espacée** : les notions déjà vues reviennent en révision à intervalles croissants (aujourd'hui, +1 jour, +3 jours, +7 jours).
- **Difficulté douce** : nombre de distracteurs, plage numérique et longueur des mots augmentent progressivement, jamais brutalement.
- **Pas d'échec** : si l'enfant hésite, on ajoute un **indice** (déjà le cas : surbrillance après 2 erreurs), puis on montre la réponse en fin de partie, en reformulant.
- **Adaptation par le profil** (§4) : le choix et la fréquence des activités dépendent des trois axes.

---

## 6. Résolution de problème simple en 2D

### 6.1 Concept retenu : « Le petit robot et le chemin » (inspiré de Bee-Bot / Cubetto / ScratchJr)

Un petit personnage (un chat 🐱, un robot 🤖) doit atteindre une cible (une fleur, une étoile) sur une **grille**. L'enfant **compose la suite d'instructions** (flèches : ⬆️⬇️⬅️➡️) puis appuie sur « Go ». Le personnage exécute la séquence pas à pas.

**Pourquoi ce choix** :
- Manipulation **concrète** de graphismes (on touche/déplace).
- Entraîne la **planification**, le **séquençage** et le **repérage spatial** (logique).
- Très facile à prendre en main : une grille 3×3 ou 4×4, 4 boutons direction.
- Progression naturelle : chemins sans obstacle → avec obstacles → avec contraintes (nombre limité de pas, ramasser des objets en route).

### 6.2 Paliers du jeu

| Niveau | Grille | Défi |
|---|---|---|
| 1 | 3×3 | Chemin direct, un seul virage. |
| 2 | 4×4 | Plusieurs virages, 2–4 instructions. |
| 3 | 5×5 | Obstacles (rochers, flaques) à contourner. |
| 4 | 5×5 | Ramasser des objets (🍎⭐) avant la cible (ordre imposé). |
| 5 | 6×6 | Nombre de pas limité + boucles douces (répéter ×2). |

### 6.3 UX & feedback

- Taille des cases généreuse (cibles tactiles ≥ 48 px), grille centrée.
- Le chemin s'**anime** case par case ; en cas d'erreur, le robot s'arrête et on peut **annuler** la dernière instruction (auto-correction).
- Renforcement : sons, étoiles, confettis (réutiliser l'existant).
- Mode « démo » : l'application montre la solution une première fois (leçon en 3 temps).

### 6.4 Autres mini-jeux de résolution (extension)

- **Tangram simple** : reconstituer une silhouette (🐠, 🏠) en glissant 5–7 pièces (inspiré d'Osmo / GCompris).
- **Balance** : équilibrer des objets de poids différents pour préparer l'égalité et l'addition (inspiré du matériel Montessori des balances).
- **Histoires à remettre en ordre** : 3–4 images à replacer (séquence temporelle, logique + langage).

---

## 7. Récompenses & motivation (conserver l'existant, l'enrichir)

- **Étoiles** par tour (déjà en place) → alimentent la collection de **stickers** (déjà en place).
- Ajouter : **badges de palier** (« Je sais lire les mots à 3 sons ! »), un **jardin virtuel** qui pousse à chaque progrès (récompense à long terme), et des **personnalisations** d'avatar.
- Toujours **positif**, jamais de retrait d'étoiles.

---

## 8. Zone Parents (enrichie)

En plus de l'existant (nom/avatar, son, voix, installation, reset) :
- **Tableau de bord discret** : paliers validés par domaine + **profil 3 axes** (pistes de talents) — sans score « QI ».
- **Rapport d'usage** : temps, activités préférées (local uniquement).
- **Options pédagogiques** : activer/désactiver le profiling, choisir l'accent anglais (US/UK), régler la difficulté de départ (niveau 0 ou 1).
- **Conseils** : suggestions d'activités hors écran (jeux de rimes, puzzles, constructions).

---

## 9. Contraintes techniques (à préserver)

- **PWA hors ligne** : tout en local, service worker, aucune requête réseau au runtime (promesse actuelle à conserver).
- **Audio synthétisé** (Web Speech + Web Audio) : pas d'assets lourds ; on garde l'abstraction `speak()`/`playSfx()` pour brancher des enregistrements réels plus tard (important pour la phonique, où la qualité de prononciation compte).
- **Accessibilité** : cibles tactiles ≥ 44 px, `prefers-reduced-motion`, contrastes, navigation clavier (dont le ParentGate, déjà corrigé).
- **Éthique / RGPD-friendly** : aucune donnée personnelle ne sort ; le profiling est local et désactivable.
- **Performance** : le tableau des 100 et le jeu 2D doivent rester fluides sur téléphone d'entrée de gamme.

---

## 10. Références & modèles inspirants

### Open source

| Projet | Licence | Ce qu'on en retient |
|---|---|---|
| **GCompris** | GPL | Le grand catalogue d'activités (lecture, calcul, logique, tangram, labyrinthes) pour 2–10 ans ; la structure par modules. |
| **ScratchJr** | MIT (open source) | Le séquençage par blocs pour tout-petits → modèle direct du « petit robot et le chemin ». |
| **Sugarizer / Sugar Labs** | Apache 2.0 | Activités éducatives légères, interface enfantine, hors ligne. |
| **Tux Paint / Tux Math / Tux Typing** | GPL | Des activités simples, sans échec, très accessibles. |
| **KGeography** (KDE Edu) | GPL | Cartes interactives, drapeaux, capitales — modèle direct pour le domaine Géographie. |

### Propriétaires (libres d'accès ou payants) — pour la pédagogie

| App | Domaine | Ce qu'on en retient |
|---|---|---|
| **Teach Your Monster to Read** | Lecture | La progression phonique gamifiée (sons → mots → phrases), très motivante. |
| **Khan Academy Kids** | Global | Le parcours adaptatif multi-domaines, sans pub, avec bibliothèque de livres. |
| **Duolingo ABC** | Lecture | La phonique structurée, courtes leçons, renforcement positif. |
| **Montessori Preschool / Busy Shapes** (Edoki Academy) | Montessori | La fidélité à la méthode, le design tactile, l'auto-correction. |
| **Montessori Letter Sounds / Numberland** (Les Trois Elles Interactive) | Montessori | Lettres rugueuses, alphabet mobile, numération concrète — référence francophone. |
| **DragonBox Numbers** | Math | La manipulation de « Nooms » (barres numériques animées) pour le sens du nombre. |
| **Reading Eggs / Hooked on Phonics** | Lecture | La phonique synthétique éprouvée. |
| **Bee-Bot / Cubetto / Osmo** | Logique & 2D | Le séquençage physique→numérique et la manipulation d'images pour résoudre. |
| **Stack the Countries / Stack the States** | Géographie | Apprendre pays, drapeaux et capitales par un jeu d'empilement. |
| **Seterra** (gratuit) | Géographie | Quiz cartes, drapeaux, capitales et langues — référence de contenu et de progression. |
| **GeoGuessr** (propriétaire) | Géographie | Repérage sur carte (inspiration pour « Place le pays sur la carte »). |

---

## 11. Feuille de route proposée (incrémentale)

1. **Phase 1 — Fondations** : moteur de niveaux/paliers + répétition espacée + stockage des progrès par domaine (réutiliser `storage.ts`).
2. **Phase 2 — Lecture phonique** : enrichir le domaine Words avec les séries rose/bleue/verte (P0→P6) et l'alphabet mobile sonore.
3. **Phase 3 — Math concret** : ajouter subitizing, perles/dizaines, balance (N0→N6).
4. **Phase 4 — Logique** : motifs, catégories, mémoire (L0→L3).
5. **Phase 5 — Jeu 2D** : « Le petit robot et le chemin » (et, plus tard, tangram).
6. **Phase 6 — Géographie** : la Terre, les continents, les pays & drapeaux, les langues (G0→G4).
7. **Phase 7 — Madagascar** : île, provinces, lieux célèbres, nature, ethnies (MG0→MG5).
8. **Phase 8 — Jeu des talents** : défis de profiling discret + dashboard parents + adaptation du parcours.
9. **Phase 9 — Polissage** : livres décodables, accent US/UK, tests a11y et smoke étendus.

---

## 12. Estimations de durée

### 12.1 Durée d'apprentissage pour l'enfant (estimation pédagogique)

Base : **10 à 15 minutes par jour**, 4 à 5 jours par semaine. Les domaines se travaillent **en parallèle** (lecture, math, logique, géographie avancent en même temps), pas en série.

| Domaine | Portée | Durée estimée (usage régulier) |
|---|---|---|
| Langage & lecture (P0→P7) | De « écoute » à « lire de petits livres » | **12–18 mois** — le plus long : apprendre à lire en anglais |
| Numération & calcul (N0→N6) | De 1–10 à +/− (et idées ×/÷) | **10–16 mois** |
| Logique & raisonnement (L0→L4) | Association → séquençage | base en **3–6 mois**, puis entretien continu |
| Géographie (G0→G4) | Terre → pays/drapeaux/langues | **2–3 mois** |
| Madagascar (MG0→MG5) | Île → provinces, lieux, ethnies | **1–2 mois** (module court et ciblé) |
| Résolution 2D | Parcours → obstacles → boucles | continu, en parallèle |

**Jalons indicatifs** :
- **~3 mois** : comprend des consignes simples, reconnaît lettres et nombres 1–10, nomme quelques pays/drapeaux.
- **~6–9 mois** : premiers mots décodables (CVC), addition visuelle, quelques provinces/lieux de Madagascar.
- **~12–18 mois** : lit des phrases et petits livres, calcule +/− jusqu'à 20, connaît continents + principaux pays + Madagascar.

> Ces durées sont **indicatives** : elles varient beaucoup selon l'âge exact, la fréquence d'usage, la présence d'un adulte et la langue maternelle.

### 12.2 Effort de développement (estimation ingénierie)

Pour un **développeur seul** (ou une petite équipe), en semaines-personne :

| Phase | Contenu | Effort |
|---|---|---|
| 1 — Fondations | paliers, répétition espacée, stockage | 2–3 sem. |
| 2 — Lecture phonique | séries rose/bleue/verte, alphabet mobile | 4–6 sem. |
| 3 — Math concret | subitizing, perles/dizaines, balance | 3–4 sem. |
| 4 — Logique | motifs, catégories, mémoire | 2–3 sem. |
| 5 — Jeu 2D « petit robot » | grille, instructions, obstacles, boucles | 3–4 sem. |
| 6 — Géographie | carte, drapeaux, langues | 2–3 sem. |
| 7 — Madagascar | provinces, lieux, ethnies | 2–3 sem. |
| 8 — Jeu des talents | profiling + dashboard parents + adaptation | 2–3 sem. |
| 9 — Polissage | tests, accents, a11y | 2 sem. |
| **Total** | | **≈ 24–32 semaines-personne** |

Soit environ **6 à 8 mois à temps plein** pour un développeur (davantage à temps partiel). Le poste le plus long hors code reste la **production de contenu de qualité** : audio phonique (prononciation), illustrations, cartes et photos des lieux.

---

## 13. Annexe — Contenus détaillés

Contenu de référence pour les domaines Géographie (§3.5) et Madagascar (§3.6). Il est prévu d'être chargé dans `src/content/` (comme `words.ts` / `stickers.ts`) pour rester hors ligne, testable et facile à enrichir.

### 13.1 Les 7 continents (en anglais)

| Continent (EN) | Français | Indice visuel |
|---|---|---|
| Africa | Afrique | 🦁 |
| Asia | Asie | 🐼 |
| Europe | Europe | 🏰 |
| North America | Amérique du Nord | 🦅 |
| South America | Amérique du Sud | 🌴 |
| Antarctica | Antarctique | 🐧 |
| Australia / Oceania | Océanie | 🦘 |

### 13.2 Pays, drapeaux & langues (jeu « Pays & drapeaux »)

Sélection de départ (extensible). Le jeu associe **drapeau ↔ pays ↔ langue ↔ salutation**.

| Pays | Drapeau | Langue(s) | Salutation |
|---|---|---|---|
| Madagascar | 🇲🇬 | Malgache, français | Salama / Manao ahoana |
| France | 🇫🇷 | Français | Bonjour |
| Royaume-Uni | 🇬🇧 | Anglais | Hello |
| États-Unis | 🇺🇸 | Anglais | Hi / Hello |
| Canada | 🇨🇦 | Anglais, français | Hello / Bonjour |
| Espagne | 🇪🇸 | Espagnol | Hola |
| Italie | 🇮🇹 | Italien | Ciao |
| Allemagne | 🇩🇪 | Allemand | Hallo |
| Brésil | 🇧🇷 | Portugais | Olá |
| Égypte | 🇪🇬 | Arabe | Ahlan / Marhaba |
| Kenya | 🇰🇪 | Swahili, anglais | Jambo |
| Inde | 🇮🇳 | Hindi (+ anglais) | Namaste |
| Chine | 🇨🇳 | Mandarin | Nǐ hǎo |
| Japon | 🇯🇵 | Japonais | Konnichiwa |
| Australie | 🇦🇺 | Anglais | G'day / Hello |

### 13.3 Madagascar — les 6 provinces

| Province (FR) | Autre nom | Chef-lieu | Zone |
|---|---|---|---|
| Antananarivo | Tananarive | Antananarivo | Centre (hautes terres) |
| Antsiranana | Diego-Suarez | Antsiranana | Nord |
| Fianarantsoa | — | Fianarantsoa | Sud-est des hautes terres |
| Mahajanga | Majunga | Mahajanga | Nord-ouest |
| Toamasina | Tamatave | Toamasina | Est |
| Toliara | Tuléar | Toliara | Sud-ouest |

### 13.4 Madagascar — lieux célèbres (par province)

| Lieu | Province | Ce qu'on y voit |
|---|---|---|
| Rova d'Antananarivo (Palais de la Reine) | Antananarivo | Histoire, vue sur la ville |
| Ambohimanga (colline royale, UNESCO) | Antananarivo | Site historique sacré |
| Lac Anosy | Antananarivo | Lac au cœur de la capitale |
| Nosy Be | Antsiranana | Île, plages, lémuriens |
| Montagne d'Ambre | Antsiranana | Parc, cascades, forêt humide |
| Mer d'Émeraude | Antsiranana | Lagon turquoise |
| Parc national de Ranomafana | Fianarantsoa | Forêt, lémuriens, sources chaudes |
| Tsingy de Bemaraha (UNESCO) | Mahajanga | Pics calcaires |
| Île Sainte-Marie (Nosy Boraha) | Toamasina | Île, baleines à bosse |
| Canal des Pangalanes | Toamasina | Voie d'eau, pirogues |
| Andasibe-Mantadia (Périnet) | Toamasina | Grand indri (lémurien) |
| Allée des baobabs (Morondava) | Toliara | Baobabs géants au coucher du soleil |
| Parc national de l'Isalo | Toliara | Canyons, piscines naturelles |
| Anakao / Ifaty | Toliara | Plages, pêche Vezo |

### 13.5 Madagascar — nature (faune & flore)

| Élément | Détail |
|---|---|
| Lémuriens | Maki catta, indri, sifaka, aye-aye, microcèbe |
| Caméléons | Caméléon panthère, brookesia (minuscule) |
| Fossa | Mammifère prédateur endémique |
| Baobabs | 6 espèces endémiques (sur 8 dans le monde) |
| Tortue radiée | Sud aride |
| Geckos | Gecko à queue plate (uroplatus) |
| Grenouilles | Mantella (couleurs vives) |
| Oiseaux | Vanga, coua, martin-pêcheur |

### 13.6 Madagascar — les 18 ethnies (les *foko 18*)

Présentées en douceur, comme **richesses culturelles** (aucune hiérarchie).

| Ethnie | Région / zone |
|---|---|
| Merina | Hautes terres centrales (Antananarivo) |
| Betsileo | Hautes terres du sud (Fianarantsoa) |
| Betsimisaraka | Côte est (Toamasina) |
| Sakalava | Côte ouest (Mahajanga → Toliara) |
| Bara | Sud (plateaux de l'Ihorombe) |
| Antandroy | Extrême sud (Ambovombe) |
| Antanosy | Sud-est (Tolagnaro / Fort-Dauphin) |
| Antaisaka | Sud-est (Vangaindrano) |
| Tanala | Forêts du sud-est (Ifanadiana / Ikongo) |
| Sihanaka | Lac Alaotra (Ambatonndrazaka) |
| Tsimihety | Nord (Mandritsara / Port-Bergé) |
| Antakarana | Extrême nord (Antsiranana / Diego) |
| Antambahoaka | Sud-est (Mananjary) |
| Antaifasy | Sud-est (Farafangana) |
| Antaimoro | Sud-est (Vohipeno / Manakara) |
| Mahafaly | Sud-ouest (Betioky / Ampanihy) |
| Vezo | Côte sud-ouest (pêcheurs) |
| Bezanozano | Centre-est (Moramanga / Anjiro) |

---

*Ce document est une proposition de conception. Toute nouvelle fonctionnalité devra conserver les engagements actuels : hors ligne, sans pub, sans compte, sans suivi, données locales uniquement.*
