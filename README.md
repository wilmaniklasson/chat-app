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
git clone https://github.com/wilmaniklasson/chat-app.git
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
JWT_SECRET=<Hämligt>
```

Ersätt `<användarnamn>` , `<lösenord>` med dina MongoDB-uppgifter, och `<Hämligt>` med din JWT secret.

Starta utvecklingsservern:

```bash
npm run server
```

Servern kommer att köras på `http://localhost:2412` (eller den port du angivit i .env-filen).

## Databasmodell

Databasmodellen innehåller tre huvudsakliga collections: **Users**, **Messages**, och **Channels**. Varje collection har definierade fält för att lagra relevant information.

## API Endpoints

Absolut! Här är några förslag på hur rubrikerna kan se ut, med tydligare uppdelning av HTTP-statuskoder och svar för varje endpoint:

---

## API Endpoints

### Användare

#### Registrera användare

- **Endpoint:** `POST /register`
- **Body:**
  ```json
  {
    "username": "user123",
    "password": "securePassword"
  }
  ```
- **Svar:**
  - **201 Created**
    - Body:
      ```json
      {
        "message": "User created",
        "token": "<JWT_TOKEN>",
        "username": "user123"
      }
      ```
  - **409 Conflict**
    - Body:
      ```json
      {
        "error": "Username already exists"
      }
      ```

---

#### Logga in

- **Endpoint:** `POST /login`
- **Body:**
  ```json
  {
    "username": "user123",
    "password": "securePassword"
  }
  ```
- **Svar:**
  - **200 OK**
    - Body:
      ```json
      {
        "_id": "<user_id>",
        "username": "user123",
        "token": "<JWT_TOKEN>"
      }
      ```
  - **401 Unauthorized**
    - Body:
      ```json
      {
        "error": "Invalid username or password"
      }
      ```

---

#### Hämta alla användare

- **Endpoint:** `GET /users`
- **Svar:**
  - **200 OK**
    - Body:
      ```json
      [
        {
          "_id": "<user_id>",
          "username": "user123"
        }
      ]
      ```
  - **404 Not Found**
    - Body:
      ```json
      {
        "error": "No users found"
      }
      ```

---

#### Hämta meddelanden mellan användare

- **Endpoint:** `GET /messages?username=<other_username>`
- **Header:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Svar:**
  - **200 OK**
    - Body:
      ```json
      {
        "user": {
          "_id": "<user_id>",
          "username": "user123"
        },
        "messages": [
          {
            "senderName": "user123",
            "recipientName": "otherUser",
            "content": "Hello!",
            "timestamp": "2024-11-04T00:00:00Z"
          }
        ]
      }
      ```
  - **401 Unauthorized**
    - Body:
      ```json
      {
        "error": "Invalid token"
      }
      ```

---

#### Ta bort användare

- **Endpoint:** `DELETE /users`
- **Header:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Svar:**
  - **200 OK**
    - Body:
      ```json
      {
        "message": "User successfully deleted"
      }
      ```
  - **404 Not Found**
    - Body:
      ```json
      {
        "error": "User not found"
      }
      ```
  - **401 Unauthorized**
    - Body:
      ```json
      {
        "error": "Invalid token"
      }
      ```

---

#### Hämta användarnamn

- **Endpoint:** `GET /users/username`
- **Header:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Svar:**
  - **200 OK**
    - Body:
      ```json
      {
        "username": "user123"
      }
      ```
  - **401 Unauthorized**
    - Body:
      ```json
      {
        "error": "Invalid token"
      }
      ```

---

### Meddelanden

#### Hämta meddelanden i en specifik kanal

- **Endpoint:** `GET /api/messages/channel/:channelName`
- **Svar:**
  - **200 OK**
    - Body: Lista över meddelanden i den specifika kanalen
  - **404 Not Found**
    - Body:
      ```json
      {
        "error": "No messages found for the specified channel"
      }
      ```
  - **500 Internal Server Error**
    - Body:
      ```json
      {
        "error": "An error occurred while retrieving messages"
      }
      ```

---

#### Skicka ett meddelande

- **Endpoint:** `POST /api/messages`
- **Body:**
  ```json
  {
    "senderName": "user1",
    "recipientName": "user2",
    "content": "Hi there!"
  }
  ```
- **Svar:**
  - **201 Created**
    - Body: Alla meddelanden för mottagaren efter skickat meddelande
  - **400 Bad Request**
    - Body:
      ```json
      {
        "error": "Invalid recipient name"
      }
      ```
  - **500 Internal Server Error**
    - Body:
      ```json
      {
        "error": "An error occurred while sending the message"
      }
      ```

---

### Kanaler

#### Skapa en ny kanal

- **Endpoint:** `POST /api/channels`
- **Body:**
  ```json
  {
    "name": "new_channel",
    "isPrivate": false
  }
  ```
- **Svar:**
  - **201 Created**
    - Body: Detaljer om den skapade kanalen
  - **400 Bad Request**
    - Body:
      ```json
      {
        "error": "Invalid channel data"
      }
      ```
  - **409 Conflict**
    - Body:
      ```json
      {
        "error": "Channel already exists"
      }
      ```

---

#### Hämta alla kanaler

- **Endpoint:** `GET /api/channels`
- **Svar:**
  - **200 OK**
    - Body: Lista över alla kanaler
  - **404 Not Found**
    - Body:
      ```json
      {
        "error": "No channels found"
      }
      ```

---

#### Hämta en specifik kanal

- **Endpoint:** `GET /api/channels/name/:name`
- **Svar:**
  - **200 OK**
    - Body: Detaljer om kanalen
  - **404 Not Found**
    - Body:
      ```json
      {
        "error": "Channel not found"
      }
      ```

---
