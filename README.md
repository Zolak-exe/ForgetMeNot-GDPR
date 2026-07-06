# 🔒 GDPR Auto-Deleter & Exposure Scanner

Identity Scanner is a backend tool designed for automated GDPR data deletion and data breach exposure checking. It queries the **XposedOrNot** public API for data leaks and automates sending GDPR "right to be forgotten" deletion requests to the DPOs (Data Protection Officers) of exposed services.

---

## 🏛️ Architecture & Core Components

- **XposedOrNot API Integration**: Fetches data leak exposures associated with an email address without requiring API keys.
- **SMTP Automation**: Automatically sends formatted GDPR deletion requests using Node Mailer via local secure mail protocols (specifically tested with ProtonMail Bridge).
- **Curated Service DB**: Static mapping database resolving leaked domains to their official DPO contact addresses.
- **Zod Schema Validation**: Enforces type safety and strict schema validation on all inputs.

---

## 🛠️ Stack & Technologies
- **Runtime**: Node.js (22+)
- **Language**: TypeScript
- **Framework**: Express
- **Email Protocol**: SMTP (Nodemailer)
- **Validation**: Zod
- **Build Tool**: TSC (TypeScript Compiler)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- A running SMTP server (like **ProtonMail Bridge** configured locally on `127.0.0.1:1143`)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy and configure the environment variables:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` with your local SMTP credentials:
   ```env
   PORT=4343
   SMTP_HOST=127.0.0.1
   SMTP_PORT=1143
   SMTP_USER=your-email@proton.me
   SMTP_PASS=your-proton-bridge-password
   SMTP_TLS=true
   ```

### Running the App
- **Development**:
  ```bash
  npm run dev
  ```
- **Production Build & Launch**:
  ```bash
  npm run build
  npm run start
  ```

---

## 📡 API Endpoints

- `GET /api/health` - Check service status.
- `POST /api/expose` - Check exposures for a specific email.
  - Body: `{"email": "user@example.com"}`
- `POST /api/send-gdpr` - Automate sending a GDPR deletion email to a specific service.
  - Body: `{"email": "user@example.com", "serviceId": "service-id"}`
- `POST /api/gdpr-mailto` - Generate a direct `mailto:` template for manual sending.

---

## 📜 License
MIT License.
