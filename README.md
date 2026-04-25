# Roomify

Roomify is a modern, AI-first architectural design environment built to help architects and designers visualize, render, and manage projects with unprecedented speed. By leveraging AI-powered workers, Roomify transforms simple floor plans into high-quality renders at the speed of thought.

## 🚀 Main Functionalities

- **AI Rendering**: Transform uploaded floor plans (JPG/PNG) into beautifully rendered architectural spaces.
- **User Authentication**: Secure sign-in and project persistence using [Puter](https://puter.com/).
- **Project Management**: Create, list, and view your design projects in a clean, organized dashboard.
- **Visualizer**: Compare source images with AI-rendered results using a side-by-side visualizer.
- **Responsive UI**: A premium, mobile-responsive interface featuring a floating "pill" navbar with modern frosted glass effects.
- **Cloud Persistence**: Automatic image hosting and data storage via Puter's cloud infrastructure.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/)
- **Cloud & AI**: [Puter.js](https://heyputer.github.io/puter.js/) (Auth, Workers, KV Storage, Hosting)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build System**: [Vite](https://vitejs.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## 📁 Folder Structure

```text
roomify/
├── app/
│   ├── lib/              # Puter actions, hosting logic, and utilities
│   ├── routes/           # Application pages (Home, Visualizer, etc.)
│   ├── app.css           # Global styles and Tailwind v4 theme configuration
│   └── root.tsx          # Main entry point and Auth state provider
├── components/
│   ├── ui/               # Reusable atomic UI components (Buttons)
│   ├── Navbar.tsx        # Responsive floating navigation
│   └── upload.tsx        # Drag-and-drop file upload component
├── public/               # Static assets
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: Latest LTS version recommended.
- **Puter Account**: Required for authentication, AI worker execution, and image hosting.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd roomify
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
Your application will be available at `http://localhost:5173`.

### Configuration

Ensure the `PUTER_WORKER_URL` is correctly configured in your constants or environment to point to your deployed Puter Worker that handles the AI rendering logic.

## 🏗 Building for Production

Create an optimized production build:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```
