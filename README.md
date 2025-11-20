# Private Driver HB — Site Next.js (V3)

Ce projet Next.js contient le site professionnel **Private Driver HB** prêt à être déployé sur Vercel.

Fonctionnalités incluses :

- Pages : Accueil, Tarifs, Réservation, Contact
- Calculateur de trajet avec Google Distance Matrix (`/api/calculate-route`)
- Estimation automatique du prix (France / Suisse)
- Paiement en ligne optionnel via **Stripe Checkout** (`/api/create-checkout-session`)
- Formulaire de contact avec envoi d'e‑mail via **Resend** (`/api/contact`)

## Installation locale

```bash
npm install
npm run dev
# puis ouvrez http://localhost:3000
```

## Variables d'environnement à configurer

En développement, créez un fichier `.env.local` à la racine du projet :

```bash
GOOGLE_MAPS_API_KEY=VOTRE_CLE_GOOGLE
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=VOTRE_CLE_GOOGLE
STRIPE_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
CONTACT_EMAIL_TO=bhubervtc@gmail.com
NEXT_PUBLIC_SITE_URL=https://privatedriverhb.com
```

Sur Vercel, renseignez les mêmes clés dans l'onglet **Environment Variables** du projet.

Si certaines clés sont absentes :

- L'API de distance renverra une valeur simulée (40 km).
- L'API de contact affichera simplement le message côté logs.
- L'API Stripe retournera une erreur (paiement en ligne indisponible).

Vous pouvez donc développer le site même sans avoir encore toutes les clés de production.
