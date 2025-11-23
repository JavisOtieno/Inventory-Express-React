# Inventory Express (React) — README

## 📦 Overview

Inventory Express is a full‑stack inventory management system built with a **React (Vite)** front‑end and an **Express.js** API backend. The architecture is designed for speed, modularity, scalability, and clean separation between client and server.

This README covers both the **React client** and the **Express backend**.

---

## 🚀 Features

* **Modern React architecture** using hooks and functional components
* **Vite** for fast development and optimized builds
* **Reusable UI Components** (Tables, Forms, Modals)
* **API integration** with backend (via Axios or Fetch)
* **Environment‑based configuration** for production and development
* **Routing** (React Router)
* **Authentication support** if using Laravel Sanctum or custom Express JWT
* **Responsive layout** powered by Tailwind CSS (if enabled)

---

## 📁 Project Structure

The project is organized into two main folders: **client** (React) and **server** (Express).

```
project-root/
│
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── layouts/        # App layouts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API calls (axios wrappers)
│   │   ├── utils/          # Helpers and constants
│   │   ├── router/         # React Router config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & utilities
│   │   ├── models/         # Database models (e.g., MongoDB or MySQL via Sequelize/Prisma)
│   │   ├── config/         # Environment and DB config
│   │   └── server.js       # App entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/yourname/inventory-express.git
cd inventory-express/client
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Create environment file

Create `.env` in the project root:

```
VITE_API_URL=http://localhost:8000/api
```

For production:

```
VITE_API_URL=https://inventorydemo.av.ke/api
```

### 4️⃣ Run development server

```
npm run dev
```

### 5️⃣ Build for production

```
npm run build
```

The output will appear in `client/dist/`.

---

## 🌐 Deployment (Apache VirtualHost)

When deploying on a Linux server using Apache, ensure your VirtualHost points to the `dist` folder:

```
<VirtualHost *:80>
    ServerName inventorydemotest.av.ke

    DocumentRoot /var/www/inventorydemo/client/dist

    <Directory /var/www/inventorydemo/client/dist>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Make sure `.htaccess` inside `/dist` handles React routing.

---

## 🔗 API Integration

Inventory Express connects to your backend through a centralized axios instance:

```
import axios from 'axios';

export default axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});
```

Supports:

* Laravel Sanctum authentication
* JWT-based Express Auth
* CRUD operations for inventory modules

---

## 📌 Common Commands

| Task                     | Command           |
| ------------------------ | ----------------- |
| Start development server | `npm run dev`     |
| Build production assets  | `npm run build`   |
| Preview production build | `npm run preview` |

---

## 🧩 Modules (Typical)

* Authentication (Login, Logout)
* Dashboard Metrics
* Inventory Items
* Categories
* Users & Roles
* Stock Levels
* Activity Logs

---

## 🚧 Troubleshooting

### ⚠️ React build not updating on server

Run:

```
npm run build
sudo systemctl restart apache2
```

If using Laravel API + Vite, ensure no mixed-content issues.

### ⚠️ "404 on page refresh"

Use a React Router rewrite rule in `.htaccess`:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 👤 Author

Developed by **Javis Otieno**

---

If you'd like, I can also generate:

* API documentation
* System architecture diagram
* Setup instructions for Express/Laravel backend
* A deployment guide for Ubuntu + Apache or Nginx
