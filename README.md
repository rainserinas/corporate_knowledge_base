# 📚 Knowledge Base App

A Next.js knowledge base application powered by **Directus CMS**, hosted on a personal VPS. The app supports role-based access — Team Leads can fully manage knowledge base entries, while Members have read-only access.

---

## 🚀 Getting Started (Running Locally)

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended) (im using v20 on my local machine)
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

## 🧪 Testing Suite

This project uses **Vitest** for unit testing. The testing strategy focuses on **Core Business Logic** — the parts of the application where errors would result in broken URLs, security breaches, or API failures.

### How to Run Tests

1. Ensure dependencies are installed:

```bash
npm install
```

2. Execute the test suite:

```bash
npm test
```

### Tested Components & Logic

We have implemented unit tests for the following critical areas:

#### 🔗 URL Slug Generation (`app/lib/utils.ts`)

- Verifies that article titles are correctly converted to SEO-friendly slugs.
- Handles edge cases like special characters (e.g., `"Next.js"` becoming `"next-js"`), multiple spaces, and trailing dashes.

#### 🧹 Data Sanitization (`app/lib/api-helpers.ts`)

- Ensures that only serializable, Directus-compatible fields are sent to the API.
- Prevents "junk" data (like React internal state or non-serializable objects) from causing `400 Bad Request` errors.

#### 🛡️ Role-Based Access Control / RBAC (`app/lib/utils.ts`)

- **Management Logic:** Verifies that only `Team Leads` and `Administrators` can Create, Edit, or Delete articles.
- **Navigation Visibility:** Ensures that the `"My Knowledge Base"` link is hidden from `Member` roles to maintain a clean and secure UI.

---

## 📝 Notes

- Do **not** commit your `.env.local` file to version control.
- Role permissions (Team Lead vs Member) are managed directly in Directus.
- Some knowledge base entries contain intentionally malformed content to demonstrate the application's ability to safely handle and render rich text editor output.
