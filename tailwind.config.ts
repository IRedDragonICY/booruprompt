// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', // <--- TAMBAHKAN BARIS INI
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Anda bisa menghapus colors ini jika tidak digunakan secara spesifik
      // colors: {
      //   background: "var(--background)",
      //   foreground: "var(--foreground)",
      // },
      // Tambahkan warna kustom jika diperlukan di sini
      colors: {
        gray: {
          // Contoh menambahkan warna spesifik jika dibutuhkan
          // 850: 'rgb(31, 41, 55)', // Sesuaikan dengan kebutuhan
        }
      }
    },
  },
  plugins: [],
} satisfies Config;