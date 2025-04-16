import "../styles/global.css";
import localFont from "next/font/local";

const yourFont = localFont({
q  src: "../fonts/test-domaine-text-bold.woff2", // path relative to this file
  display: "swap",
  variable: "--font-yourfont",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={yourFont.className}>
      <Component {...pageProps} />
    </main>
  );
}
