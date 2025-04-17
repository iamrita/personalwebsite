import "../styles/global.css";
//import "../styles/bookshelf.css";

export default function App({ Component, pageProps }) {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  );
}
