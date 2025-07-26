Here is the full `README.md` content in one copy-paste block for your **Bank Lending System** project:

---

```markdown
# 🏦 Bank Lending System

A full-stack web application to manage loans, payments, and customer summaries using:

- 🚀 React.js + Tailwind CSS (frontend)
- 🖥️ Node.js + Express (backend)
- 🗄️ SQLite (database)

---

## 📁 Folder Structure

```

bank-lending-system/
│
├── backend/                # Node.js + Express API
│   └── server.js           # All backend logic in one file
│
├── frontend/               # React + Tailwind app
│   ├── src/
│   │   ├── pages/          # CreateLoan, MakePayment, Ledger, Overview, Home
│   │   └── App.js          # Router and layout
│   ├── public/
│   └── tailwind.config.js  # Tailwind setup

````

---

## 🧑‍💻 Setup Instructions

### ✅ Prerequisites

- Node.js (v16+)
- npm (v7+)

---

### 📦 Backend Setup

```bash
cd backend
npm init -y
npm install express cors sqlite3 uuid
node server.js
````

> Backend runs at: `http://localhost:5000`

---

### 💻 Frontend Setup

```bash
cd frontend
npx create-react-app .
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**🛠️ Tailwind Setup:**

* `tailwind.config.js`

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

* `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then:

```bash
npm start
```

> Frontend runs at: `http://localhost:3000` or `http://localhost:5173` (if using Vite)

---

## ✨ Features

* Create Loan (auto-add customer)
* Record EMI / Lump Sum payments
* View detailed Ledger (balance + history)
* Customer-wise Loan Overview

---

## 📘 API Endpoints

| Method | Endpoint                                 | Description            |
| ------ | ---------------------------------------- | ---------------------- |
| POST   | `/api/v1/loans`                          | Create a new loan      |
| POST   | `/api/v1/loans/:loanId/payments`         | Record a loan payment  |
| GET    | `/api/v1/loans/:loanId/ledger`           | View ledger for a loan |
| GET    | `/api/v1/customers/:customerId/overview` | Customer loan summary  |

---

## 💾 Persistent DB (Optional)

Replace this in `server.js`:

```js
const db = new sqlite3.Database(":memory:");
```

With:

```js
const db = new sqlite3.Database("bank_lending.db");
```

This keeps data even after restarting the server.

---

## 🧪 Testing

You can test API endpoints using:

* Postman / Thunder Client
* Frontend UI forms

---

## 📜 License

MIT License. Free to use and modify.

---

## 🙋‍♂️ Author

Created with ❤️ by **Your Name**

Feel free to contribute or report issues.

```

---

✅ You can now paste this entire block into a `README.md` file directly in your project root. Let me know if you want a ZIP file including it!
```
