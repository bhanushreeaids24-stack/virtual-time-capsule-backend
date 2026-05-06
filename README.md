# 🌸 Virtual Time Capsule — Complete Setup Guide

A beautiful digital greeting card platform with bouquet builder, AI messages, QR codes, and animated receiver views.

---

## 📁 Project Structure

```
virtual-time-capsule/
│
├── index.html                  ← Frontend (open in browser)
│
└── server/
    ├── server.js               ← Main Express server
    ├── .env                    ← Environment variables
    ├── package.json
    │
    ├── config/
    │   └── db.js               ← MongoDB connection
    │
    ├── models/
    │   └── Card.js             ← Mongoose schema
    │
    ├── controllers/
    │   ├── cardController.js   ← Card CRUD logic
    │   └── messageController.js← AI message generator
    │
    ├── routes/
    │   ├── cardRoutes.js       ← /api/cards routes
    │   └── messageRoutes.js    ← /api/generate-message
    │
    └── uploads/                ← Uploaded images stored here
```

---

## 🚀 Step-by-Step Setup

### Step 1: Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2: Install MongoDB (Option A — Local)
Download from https://www.mongodb.com/try/download/community
- Install and start the MongoDB service
- It runs on port 27017 by default

**OR Option B — MongoDB Atlas (Cloud, easier):**
1. Go to https://cloud.mongodb.com
2. Create a free account → Create a cluster (free tier)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Paste it in `server/.env` as `MONGO_URI=...`

### Step 3: Install backend dependencies
```bash
cd server
npm install
```

### Step 4: Start the backend server
```bash
npm start
```
You should see:
```
🚀 Server running at http://localhost:5000
✅ MongoDB Connected: localhost
🌸 Virtual Time Capsule is ready!
```

### Step 5: Open the frontend
Simply open `index.html` in your browser (double-click it).

> The app works in **offline mode** (using localStorage) even without the backend running!

---

## 🧪 Test APIs with Postman

### Create a Card
```
POST http://localhost:5000/api/cards
Content-Type: multipart/form-data

Fields:
  receiverName  = "Priya"
  senderName    = "With love, Mum"
  occasion      = "Birthday"
  message       = "Happy Birthday Priya! 🌸"
  bouquet       = ["🌹","🌷","🌸"]
  theme         = "pastel"
```

### Get a Card
```
GET http://localhost:5000/api/cards/{cardId}
```

### Generate AI Message
```
POST http://localhost:5000/api/generate-message
Content-Type: application/json

{
  "occasion": "Birthday",
  "tone": "emotional",
  "receiverName": "Priya"
}
```

### Like a Card
```
POST http://localhost:5000/api/cards/{cardId}/like
```

### List All Cards
```
GET http://localhost:5000/api/cards
```

---

## ✨ Features

| Feature | Status |
|---|---|
| Create greeting cards | ✅ |
| Upload photos | ✅ |
| AI message generator | ✅ |
| Bouquet builder (10 flowers + leaves) | ✅ |
| QR code generation | ✅ |
| Shareable links | ✅ |
| Receiver animated view | ✅ |
| Falling petals animation | ✅ |
| Background music toggle | ✅ |
| React ❤️ button | ✅ |
| Countdown timer | ✅ |
| Theme selection (pastel/light/dark) | ✅ |
| Offline mode (localStorage fallback) | ✅ |
| MongoDB persistence | ✅ |

---

## 🔧 Troubleshooting

**"MongoDB connection error"**
→ Make sure MongoDB is running: `mongod` in terminal
→ Or use MongoDB Atlas and update MONGO_URI in .env

**"CORS error" in browser**
→ Backend CORS is already configured for all origins
→ Make sure server is running on port 5000

**QR code doesn't work**
→ Share the link manually using the "Copy" button
→ The QR library loads from CDN — needs internet connection

**Images not showing on receiver view**
→ Make sure backend is running (images served from /uploads)
→ In offline mode, images are stored as base64 in localStorage

---

## 📦 npm packages used

| Package | Purpose |
|---|---|
| express | Web framework |
| mongoose | MongoDB ORM |
| multer | File/image upload |
| qrcode | QR code generation |
| uuid | Unique card IDs |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| nodemon | Auto-restart on change (dev) |
