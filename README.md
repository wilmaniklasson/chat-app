# Chappy API

Detta är ett **Chappy API** byggt med **Node.js** och **Express**, som följer RESTful-principer. API:t innehåller grundläggande CRUD-operationer för hantering av användare, meddelanden och kanaler, samt autentisering. Projektet är en del av en teknikstack som inkluderar **MongoDB**, **Express**, **Node.js** och **React**.

## Innehållsförteckning

- [Introduktion](#introduktion)
- [Installation](#installation)
- [Databasmodell](#databasmodell)
- [API Endpoints](#api-endpoints)
  - [Användare](#användare)
  - [Meddelanden](#meddelanden)
  - [Kanaler](#kanaler)
  - [Autentisering](#autentisering)
- [Exempel på begäran och svar](#exempel-på-begäran-och-svar)

## Introduktion

Chappy API tillhandahåller ett enkelt gränssnitt för att hantera användare, meddelanden och kanaler i en chattapplikation. API:t möjliggör användarregistrering, inloggning och hantering av meddelanden och kanaler.

## Installation

Klona repositoryt:

```bash
git clone https://github.com/your-username/chappy-api.git
cd chappy-api
```

Installera beroenden:

```bash
npm install
```

Se till att du har en .env-fil i projektets rotkatalog:

```
CONNECTION_STRING=mongodb+srv://<användarnamn>:<lösenord>@kluster0.oiln8.mongodb.net/
MONGODB_DB_NAME=chappy
PORT=2412
```

Ersätt `<användarnamn>` och `<lösenord>` med dina MongoDB-uppgifter.

Starta utvecklingsservern:

```bash
npm run server
```

Servern kommer att köras på `http://localhost:2412` (eller den port du angivit i .env-filen).

## Databasmodell

Databasmodellen innehåller tre huvudsakliga collections: **Users**, **Messages**, och **Channels**. Varje collection har definierade fält för att lagra relevant information.

## API Endpoints

### Användare

Dokumenterar API-endpunkterna relaterade till användare.

---

### Meddelanden

Dokumenterar API-endpunkterna relaterade till meddelanden.

---

### Kanaler

Dokumenterar API-endpunkterna relaterade till kanaler.

---

### Autentisering

Dokumenterar API-endpunkterna relaterade till autentisering, inklusive registrering och inloggning.

---

## Exempel på begäran och svar

Denna sektion innehåller exempel på hur man gör begärningar till API:t och vilka svar man kan förvänta sig.

---
