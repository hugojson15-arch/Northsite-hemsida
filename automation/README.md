# Northsite – automatiskt mejlsvar via n8n

Detta n8n-flöde tar emot data från både "Begär offert"-formuläret och
kontaktformuläret på hemsidan, mejlar dig (Hugo) om den nya förfrågan och
skickar automatiskt ett bekräftelsemejl till kunden.

## 1. Importera flödet

1. Öppna din n8n-instans (självhostad eller n8n Cloud).
2. Skapa ett nytt flöde → menyn (⋮) → **Import from File** → välj
   `n8n-workflow.json` i denna mapp.

## 2. Koppla en e-postavsändare (SMTP)

Flödets fyra "Send Email"-noder (`Mejla Hugo – Offert`, `Autosvar – Offert`,
`Mejla Hugo – Kontakt`, `Autosvar – Kontakt`) behöver en SMTP-koppling för
`contact.northsite@gmail.com`:

1. Skapa ett **App-lösenord** för Gmail-kontot: Google-kontot →
   Säkerhet → Tvåstegsverifiering måste vara på → "Applösenord" →
   skapa ett för "Mejl".
2. I n8n: **Credentials** → **New** → **SMTP**:
   - Host: `smtp.gmail.com`
   - Port: `465`
   - SSL/TLS: på
   - User: `contact.northsite@gmail.com`
   - Password: app-lösenordet från steg 1
3. Öppna varje "Send Email"-nod i flödet och välj den nya SMTP-kopplingen
   (de importeras utan koppling, så detta måste göras manuellt en gång).

## 3. Aktivera flödet och hämta webhook-URL:en

1. Klicka **Active** (uppe till höger) för att slå på flödet.
2. Öppna noden **Webhook – Formulär** och kopiera **Production URL**.
3. Klistra in den URL:en som värde för `N8N_WEBHOOK_URL` i `js/main.js`
   (högst upp i filen).

Tills `N8N_WEBHOOK_URL` är ifylld fortsätter formulären att fungera som
innan (de öppnar ditt e-postprogram direkt) – så sidan går aldrig sönder
under tiden du sätter upp n8n.

## 4. CORS

Om formulären inte kan nå webhooken från webbläsaren (fel i konsolen om
"CORS"), öppna **Webhook – Formulär** → **Options** → **Allowed Origins
(CORS)** och sätt den till din domän (t.ex. `https://northsite.se`) eller
`*` för att testa.

## Hur det fungerar

- Webbsidan skickar ett JSON-anrop (`fetch`) till webhooken med ett
  `formType`-fält (`"offert"` eller `"kontakt"`) plus formulärets fält.
- Flödet grenar på `formType`, mejlar dig med förfrågan och skickar
  sedan ett automatiskt svar till kundens e-postadress.
- Flödet svarar `{ "success": true }` till sidan, som då visar ett
  bekräftelsemeddelande för besökaren.
