import localFont from "next/font/local";

const headerFont = localFont({
  src: "../fonts/test-domaine-text-bold.woff2", // path relative to this file
  display: "swap",
  variable: "--font-yourfont",
});

export default headerFont;
