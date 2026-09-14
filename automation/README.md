# Northsite – offert till kalkylark, kontakt till mejl

Detta n8n-flöde tar emot data från hemsidans två formulär och hanterar dem olika:

- **Begär offert** → sparas som en ny rad i ett Google Kalkylark (namn,
  telefon, mejl, problem) och kunden får ett kort automatiskt tack-mejl.
- **Kontakta mig** → skickas direkt vidare som ett mejl till dig, inget
  automatsvar.

## 1. Importera flödet

1. Öppna din n8n-instans (självhostad eller n8n Cloud).
2. Skapa ett nytt flöde → menyn (⋮) → **Import from File** → välj
   `n8n-workflow.json` i denna mapp.

## 2. Skapa kalkylarket för offertförfrågningar

1. Skapa ett nytt Google Kalkylark (t.ex. döp det till "Northsite – Offertförfrågningar").
2. Lägg in en rubrikrad på första fliken med exakt dessa kolumner, i denna ordning:
   ```
   Datum | Namn | Telefon | E-post | Problem
   ```

## 3. Koppla Google Sheets i n8n

1. Öppna noden **"Lägg till i kalkylark – Offert"** i flödet.
2. Under **Credential** → **Create new credential** → logga in med samma
   Google-konto som äger kalkylarket och godkänn åtkomsten.
3. Under **Document** — välj kalkylarket du skapade i steg 2.
4. Under **Sheet** — välj fliken (oftast "Sheet1" eller "Blad1").
5. Kontrollera att kolumnerna under **"Values to Send"** matchar rubrikraden
   (Datum, Namn, Telefon, E-post, Problem) — de är redan förifyllda men
   dubbelkolla att de känns igen efter att du valt kalkylark/flik.

## 4. Koppla en e-postavsändare (SMTP)

Flödets två "Send Email"-noder (`Autosvar – Offert` och `Mejla Hugo – Kontakt`)
behöver en SMTP-koppling för `contact.northsite@gmail.com`:

1. Skapa ett **App-lösenord** för Gmail-kontot: Google-kontot →
   Säkerhet → Tvåstegsverifiering måste vara på → "Applösenord" →
   skapa ett för "Mejl".
2. I n8n: **Credentials** → **New** → **SMTP**:
   - Host: `smtp.gmail.com`
   - Port: `465`
   - SSL/TLS: på
   - User: `contact.northsite@gmail.com`
   - Password: app-lösenordet från steg 1
3. Öppna **"Autosvar – Offert"** och **"Mejla Hugo – Kontakt"** och välj
   den nya SMTP-kopplingen i båda (de importeras utan koppling, så detta
   måste göras manuellt en gång).

## 5. Aktivera flödet och hämta webhook-URL:en

1. Klicka **Active** (uppe till höger) för att slå på flödet.
2. Öppna noden **Webhook – Formulär** och kopiera **Production URL**.
3. Klistra in den URL:en som värde för `N8N_WEBHOOK_URL` i `js/main.js`
   (högst upp i filen).

Tills `N8N_WEBHOOK_URL` är ifylld fortsätter formulären att fungera som
innan (de öppnar ditt e-postprogram direkt) – så sidan går aldrig sönder
under tiden du sätter upp n8n.

## 6. CORS

Om formulären inte kan nå webhooken från webbläsaren (fel i konsolen om
"CORS"), öppna **Webhook – Formulär** → **Options** → **Allowed Origins
(CORS)** och sätt den till din domän (t.ex. `https://northsite.se`) eller
`*` för att testa.

## Hur det fungerar

- Webbsidan skickar ett JSON-anrop (`fetch`) till webhooken med ett
  `formType`-fält (`"offert"` eller `"kontakt"`) plus formulärets fält.
- **Offert:** flödet lägger till en rad i kalkylarket och skickar ett kort
  tack-mejl till kundens e-postadress.
- **Kontakt:** flödet mejlar meddelandet direkt till dig, inget automatsvar.
- Flödet svarar `{ "success": true }` till sidan, som då visar ett
  bekräftelsemeddelande för besökaren.
