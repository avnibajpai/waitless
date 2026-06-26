<p align="center">
  <img src="waitless/assets/wAItless-logo.png" alt="wAItless Logo" width="420">
</p>

<h2 align="center">
Turn Waiting Hours into Productive Minutes.
</h2>

<p align="center">
AI-Powered Virtual Queue Management Platform
</p>

<p align="center">
<b>A digital presence that waits in queues for you—so you don't have to.</b>
</p>
---
# Waitless Mobile App 📱

Welcome to the **Waitless** mobile application workspace. This repository contains both the backend and frontend services, built with a modern, high-performance mobile stack.

---

## 📂 Project Structure

The repository is structured as a monorepo splitting mobile operations and backend architecture cleanly:

```text
frontend/                 # React Native / Expo Mobile Application           
│   ├── assets/           # App icons, splash screens, images
│   ├── src/
│   │   ├── components/   # Shared UI components
│   │   ├── navigation/   # Root and Stack navigators
│   │   ├── screens/      # Core screens (Profile, Staff Dashboard, Venue Details, etc.)
│   │   ├── services/     # API handlers & mock endpoints
│   │   └── types/        # TypeScript declarations
│   ├── package.json      # Frontend app configuration
│   └── tsconfig.json     # TypeScript layout rules
├── backend/              # Server management and application engine
└── README.md             # Project roadmap and user guide
```
## 🛠️ Prerequisites
Before launching the workspace, make sure you have the following installed on your machine:
1. Node.js (v18.x or higher recommended)
2. pnpm (Fast, disk space efficient package manager)
3. Expo Go app installed on your physical iOS/Android device (to preview the app)
### 🚀 Getting Started
1. Clone the Repository
```text
git clone https://github.com/avnibajpai/waitless.git
cd waitless
```
2. Launching the Mobile App (Frontend)
Because the configuration files are housed within the micro-directories, you must navigate into the frontend folder to access the package manifest:
Option A (Using pnpm):
```text
# Step into the frontend space
cd frontend
# Install the project dependencies
pnpm install
# Start the Expo development server
pnpm start
```
Option B: Using npm / npx
If your global environment defaults to npm, use these commands instead:
```text
cd frontend
npm install
npx expo start
```

## 📱 How to Run the App on Your Device
1. Once you run pnpm start, the Expo Developer Tools will spin up in your terminal, showing a QR Code.
2. Download the Expo Go app from the Apple App Store or Google Play Store.
3. Open your device's camera (iOS) or the Expo Go App scan feature (Android).
4. Scan the terminal's QR code.
5. The application will build Bundles natively on your device over Wi-Fi!
💡 Pro-Tip: Make sure both your laptop and your mobile device are connected to the exact same Wi-Fi network network, otherwise Expo Go won't be able to discover your local server.