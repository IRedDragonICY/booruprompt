# 🏷️ Booru Tag Extractor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-96.4%25-blue?logo=typescript)

> Extract tags from booru websites with ease. Just paste a booru post URL, and this tool will fetch and display all the associated tags, ready for you to copy.

📌 **[Live Demo](https://booruprompt.vercel.app)** | [GitHub Repository](https://github.com/IRedDragonICY/booruprompt)

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7680d50-595e-4e4e-9375-21b4f7eced81" alt="Booru Tag Extractor Screenshot" width="600">

</p>

## ✨ Features

- 🖼️ **Multi-site Support** - Works with popular booru sites:
  - Danbooru
  - Safebooru
  - Gelbooru
  - Rule34
  - e621
- 🏷️ **Tag Categorization** - Intelligently categorizes tags:
  - Copyright (Series/Franchise)
  - Character
  - General
  - Meta
  - Other (Artists, etc.)
- 🔄 **CORS Proxy Options** - Multiple proxy options for reliable fetching
- 🎨 **Modern UI** - Sleek, responsive design with smooth animations
- 📱 **Mobile-friendly** - Works great on all device sizes
- 🔍 **Filtering** - Toggle tag categories on/off for custom tag lists
- 📋 **One-Click Copy** - Copy formatted tags to clipboard with a single click

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IRedDragonICY/booruprompt.git
cd booruprompt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 Usage

1. Paste a valid booru post URL into the input field
2. Select a CORS proxy option (AllOrigins recommended)
3. Click "Extract Tags" button
4. Use the tag category toggles to filter which tags you want
5. Click "Copy Tags" to copy the formatted tags to your clipboard

## 💻 Tech Stack

- **[Next.js](https://nextjs.org/)** - React framework with server-side rendering
- **[React](https://reactjs.org/)** - UI library for building interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[JSDOM](https://github.com/jsdom/jsdom)** - HTML parsing and manipulation

## 🛠️ Development

### Project Structure

```
booruprompt/
├── app/               # Next.js app directory
│   ├── page.tsx       # Main page component
│   ├── layout.tsx     # Root layout component
├── components/        # React components
├── public/            # Static assets
├── styles/            # Global styles
├── types/             # TypeScript type definitions
├── next.config.js     # Next.js configuration
└── package.json       # Project dependencies
```

### Available Scripts

- `npm run dev` - Run the development server with Turbopack
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Lint the codebase

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- [@IRedDragonICY](https://x.com/ireddragonicy) on X (Twitter)
- [GitHub Issues](https://github.com/IRedDragonICY/booruprompt/issues) for bug reports and feature requests

## 🙏 Acknowledgements

- All the booru sites for their amazing content and services
- The open-source community for tools and libraries used in this project
- [Vercel](https://vercel.com/) for hosting the application

---

<p align="center">Made with ❤️ by <a href="https://github.com/IRedDragonICY">IRedDragonICY</a></p>
