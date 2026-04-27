# 📚 Knowledge Base App

A Next.js knowledge base application powered by **Directus CMS**, hosted on a personal VPS. The app supports role-based access — Team Leads can fully manage knowledge base entries, while Members have read-only access.

---

## 🚀 Getting Started (Running Locally)

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
NEXT_PUBLIC_DIRECTUS_URL=https://kb-exam.slipstreamph.com
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 🔐 Login Credentials

> **Note:** There is no sign-up page. Use the credentials below to log in.

### 👔 Team Leads

Team Leads have **full access** — they can **create, update, and delete** knowledge base entries.

| Email                    | Password         |
| ------------------------ | ---------------- |
| johndoe@gmail.com        | tAEFdG1xzo4NlbHp |
| kurtcastro0528@gmail.com | 020BMpp3ZenR7hte |

### 👤 Member

Members have **read-only access** — they can browse and view knowledge base entries but cannot make any changes.

| Email                 | Password         |
| --------------------- | ---------------- |
| apollosmart@gmail.com | xBE4yRMv2HCHqOrh |

---

## 🛠️ Tech Stack & Integrations

### Directus CMS

This project is integrated with **[Directus](https://directus.io/)** as its headless CMS backend. Directus manages all knowledge base content, user authentication, and role-based permissions. The Directus instance is **self-hosted on a personal VPS** and is accessible at:

```
https://kb-exam.slipstreamph.com
```

### Frontend

- **Next.js** — React framework for the frontend
- **Directus SDK** — For communicating with the Directus REST API

---

## 📝 Notes

- Do **not** commit your `.env.local` file to version control.
- Role permissions (Team Lead vs Member) are managed directly in Directus.
