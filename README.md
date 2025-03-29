# 🏷️ Booru Tag Extractor

<p align="center">
  <a href="https://github.com/IRedDragonICY/booruprompt/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js->=14-black?logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React->=18-blue?logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Included-blue?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-Included-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-Included-purple?logo=framer&logoColor=white" alt="Framer Motion"></a>
</p>

<p align="center">
  Effortlessly extract, categorize, and copy tags from your favorite booru sites.
</p>

<p align="center">
  <a href="https://booruprompt.vercel.app"><strong>🚀 Live Demo</strong></a> ·
  <a href="https://github.com/IRedDragonICY/booruprompt"><strong>📦 GitHub Repo</strong></a> ·
  <a href="https://github.com/IRedDragonICY/booruprompt/issues">Report Bug</a> ·
  <a href="https://github.com/IRedDragonICY/booruprompt/issues">Request Feature</a>
</p>

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7680d50-595e-4e4e-9375-21b4f7eced81" alt="Booru Tag Extractor Screenshot" width="70%">
</p>

Tired of manually selecting and copying tags for your AI prompts or image organization? Booru Tag Extractor streamlines the process. Just paste a post URL, and let the tool handle the rest!

## ✨ Core Features

*   **🤖 Automatic Extraction:** Paste a URL, and tags appear automatically (configurable).
*   **🖼️ Broad Site Support:** Works seamlessly with:
  *   **Danbooru**
  *   **Safebooru** (Multiple URL formats)
  *   **Gelbooru**
  *   **Rule34**
  *   **e621**
*   **🏷️ Smart Categorization:** Tags are automatically sorted into:
  *   `Copyright` `Character` `General` `Meta` `Other (Artist, etc.)`
*   **🎨 Sleek & Modern UI:** Clean interface built with Tailwind CSS and Framer Motion.
*   **🌓 Dark Mode:** Comfortable viewing in any lighting condition.
*   **🔍 Intuitive Filtering:** Easily toggle categories to customize your tag list.
*   **📋 Effortless Copy-Paste:** Copy the filtered, comma-separated tags with a single click.
*   **📱 Responsive Design:** Looks and works great on desktop, tablet, and mobile.
*   **🌐 Reliable Fetching:** Uses a CORS proxy (`AllOrigins`) to bypass browser restrictions.

## 🚀 Getting Started

Get the project up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or newer recommended)
*   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/IRedDragonICY/booruprompt.git
    cd booruprompt
    ```

2.  **Install dependencies:**
    ```bash
    # Using npm
    npm install

    # Using yarn
    # yarn install

    # Using pnpm
    # pnpm install
    ```

3.  **Run the development server:**
    ```bash
    # Using npm
    npm run dev

    # Using yarn
    # yarn dev

    # Using pnpm
    # pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🕹️ How to Use

1.  **Paste URL:** Copy a direct link to a post page from a supported booru site (e.g., `https://danbooru.donmai.us/posts/123456`) and paste it into the input field.
2.  **Wait (or Click):**
  *   If *Automatic Extraction* is enabled (default), tags and a preview should load shortly after pasting.
  *   Otherwise, click the **"Extract Manually"** button.
3.  **Filter (Optional):** Use the category toggles below the preview to show/hide specific tag types. The tag count updates dynamically.
4.  **Copy:** Click the **"Copy Tags"** button to copy the currently displayed, comma-separated tags to your clipboard.

## 💻 Tech Stack

*   **[Next.js](https://nextjs.org/)**: React framework for production.
*   **[React](https://react.dev/)**: Library for building user interfaces.
*   **[TypeScript](https://www.typescriptlang.org/)**: Typed superset of JavaScript.
*   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework.
*   **[Framer Motion](https://www.framer.com/motion/)**: Animation library for React.
*   **DOMParser API**: Native browser API for parsing HTML fetched via proxy.

## 🛠️ Development

This project uses the standard Next.js App Router structure.

### Available Scripts

*   `dev`: Starts the development server (usually on `localhost:3000`).
*   `build`: Creates a production-ready build.
*   `start`: Runs the production build.
*   `lint`: Lints the codebase using ESLint.

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please ensure your code adheres to the project's linting rules and includes updates to documentation if necessary.

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 📬 Contact

IRedDragonICY - [@IRedDragonICY](https://x.com/ireddragonicy)

Project Link: [https://github.com/IRedDragonICY/booruprompt](https://github.com/IRedDragonICY/booruprompt)

File bugs or suggest features via [GitHub Issues](https://github.com/IRedDragonICY/booruprompt/issues).

## 🙏 Acknowledgements

*   The teams behind the amazing **Booru websites**.
*   **[AllOrigins](https://allorigins.win/)** for the reliable CORS proxy service.
*   **[Vercel](https://vercel.com/)** for seamless hosting.
*   All the **open-source libraries and tools** that made this project possible.

---

<p align="center">
  Made with <span style="color: #e25555;">♥</span> by <a href="https://github.com/IRedDragonICY">IRedDragonICY</a>
</p>