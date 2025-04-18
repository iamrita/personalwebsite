import Layout from "../../components/layout";
import Bookshelf from "../../components/Bookshelf";
const shelf1 = [
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1641271171i/58085267.jpg", // Different
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1448108591i/27071490.jpg", // Homegoing

  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1439218170i/4364.jpg", // Maximum City
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1529845599i/34051011.jpg", // Pachinko
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1683818219i/139400713.jpg", // Martyr
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1577090827l/51791252.jpg", // The Vanishing Half 
];
export default function Recommendation() {
  return (
    <Layout>
      <p>
        I often times find it difficult to find what book to read next. Luckily,
        AI has been the greatest help in helping me choose my next read,
        depending on what books I've liked in the past. Play around by clicking
        on the books in the shelves below to see what book you should read next!
      </p>
      <Bookshelf books={shelf1} />
      {/* <Bookshelf /> */}
    </Layout>
  );
}
