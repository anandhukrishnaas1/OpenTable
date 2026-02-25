# OpenTable 🚀

A modern, AI-powered food rescue web application dedicated to eliminating food waste and connecting community resources with local NGOs, food banks, and shelters. 

OpenTable leverages React, Tailwind CSS, and Google's Gemini Multimodal AI to create a seamless, dignified experience for donors and volunteers alike.

## ✨ Features

- **AI-Powered Food Analysis**: Snap a photo of a donation and our intelligent system instantly categorizes, estimates freshness, and determines the safest distribution method.
- **Dynamic Real-Time Feed**: Powered by Firebase Firestore, see live, real-time updates of local food donations right on the homepage.
- **Volunteer Coordination**: Volunteers get matched with nearby donation pickups and can claim them instantly.
- **Intuitive UI**: Smooth gradients, responsive layouts, and floating animations for an engaging, premium user experience.

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router, Vite
- **Styling**: Vanilla Tailwind CSS + Lucide React icons
- **Backend & Database**: Firebase (Firestore)
- **AI Integration**: Google Generative AI (`@google/genai`)
- **PWA Ready**: Vite PWA plugin for a native-app-like experience

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd opentable
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your required API keys:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The application will typically start on `http://localhost:2005` (or another available Vite port).*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is proprietary and all rights are reserved by OpenTable (2026).
