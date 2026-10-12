import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseGoodreadsRss,
  selectShelfBooks,
  shelfFeedUrl,
  staleReadingDocIds,
} from "./rss.ts";

const EMPTY_SHELF = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <xhtml:meta xmlns:xhtml="http://www.w3.org/1999/xhtml" name="robots" content="noindex" />
    <title>Amrita's bookshelf: currently-reading</title>
    <atom:link href="https://www.goodreads.com/review/list_rss/118336006?shelf=currently-reading" rel="self" type="application/rss+xml" />
    <description><![CDATA[Amrita's bookshelf: currently-reading]]></description>
  </channel>
</rss>`;

function item(options: {
  id: string;
  title: string;
  author?: string;
  added?: string;
  readAt?: string;
  largeImage?: string;
  image?: string;
  rating?: string;
  average?: string;
  pages?: string;
}): string {
  const large =
    options.largeImage === undefined
      ? `https://i.gr-assets.com/images/${options.id}.jpg`
      : options.largeImage;
  return `<item>
    <title>${options.title}</title>
    <link><![CDATA[https://www.goodreads.com/review/show/${options.id}?utm_medium=api&utm_source=rss]]></link>
    <book_id>${options.id}</book_id>
    <book_image_url><![CDATA[${options.image ?? `https://i.gr-assets.com/images/${options.id}._SY75_.jpg`}]]></book_image_url>
    <book_large_image_url><![CDATA[${large}]]></book_large_image_url>
    <book id="${options.id}"><num_pages>${options.pages ?? ""}</num_pages></book>
    <author_name>${options.author ?? "Ada Author"}</author_name>
    <user_rating>${options.rating ?? "0"}</user_rating>
    <user_read_at>${options.readAt ? `<![CDATA[${options.readAt}]]>` : ""}</user_read_at>
    <user_date_added>${options.added ? `<![CDATA[${options.added}]]>` : ""}</user_date_added>
    <average_rating>${options.average ?? "4.25"}</average_rating>
  </item>`;
}

function feed(items: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <xhtml:meta xmlns:xhtml="http://www.w3.org/1999/xhtml" name="robots" content="noindex" />
    <title>bookshelf</title>
    <atom:link href="https://www.goodreads.com/review/list_rss/118336006?shelf=read" rel="self" type="application/rss+xml" />
    ${items.join("\n")}
  </channel>
</rss>`;
}

describe("shelfFeedUrl", () => {
  it("builds the public currently-reading and read feeds from one user id", () => {
    assert.equal(
      shelfFeedUrl("118336006", "currently-reading"),
      "https://www.goodreads.com/review/list_rss/118336006?shelf=currently-reading"
    );
    assert.equal(
      shelfFeedUrl("118336006", "read"),
      "https://www.goodreads.com/review/list_rss/118336006?shelf=read&sort=date_read&order=d"
    );
  });
});

describe("parseGoodreadsRss", () => {
  it("treats a channel with no items as an empty shelf", () => {
    assert.deepEqual(parseGoodreadsRss(EMPTY_SHELF), []);
  });

  it("rejects a non-RSS body instead of treating it as an empty shelf", () => {
    assert.throws(
      () => parseGoodreadsRss("<html><body>blocked</body></html>"),
      /not an RSS channel/
    );
  });

  it("reads a Goodreads item, including an empty user_read_at and nested page count", () => {
    const [book] = parseGoodreadsRss(
      feed([
        item({
          id: "2157352",
          title: "Sex Diary of a Metaphysician",
          author: "Colin Wilson",
          added: "Sat, 05 Nov 2022 15:24:40 -0700",
          largeImage: "",
          image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1245107610l/2157352._SY75_.jpg",
          pages: "256",
          rating: "0",
          average: "4.25",
        }),
      ])
    );

    assert.equal(book.bookId, "2157352");
    assert.equal(book.title, "Sex Diary of a Metaphysician");
    assert.equal(book.author, "Colin Wilson");
    const [spaced] = parseGoodreadsRss(
      feed([
        item({
          id: "236643269",
          title: "This Is Not About Running",
          author: "Mary    Cain",
          readAt: "Tue, 6 Oct 2026 00:00:00 +0000",
        }),
      ])
    );
    assert.equal(spaced.author, "Mary Cain");
    assert.equal(spaced.dateRead, "2026-10-06T00:00:00.000Z");
    assert.equal(book.dateRead, null);
    assert.equal(book.dateAdded, "2022-11-05T22:24:40.000Z");
    assert.equal(
      book.coverImageUrl,
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1245107610l/2157352._SY75_.jpg"
    );
    assert.equal(book.bookLink, "https://www.goodreads.com/book/show/2157352");
    assert.equal(book.userRating, null);
    assert.equal(book.averageRating, 4.25);
    assert.equal(book.numPages, 256);
  });

  it("parses a CDATA user_read_at", () => {
    const [book] = parseGoodreadsRss(
      feed([
        item({
          id: "106484",
          title: "Hard-Boiled Wonderland and the End of the World",
          readAt: "Sun, 03 Jul 2016 00:00:00 -0700",
          added: "Thu, 24 Nov 2016 08:11:31 -0800",
          rating: "5",
        }),
      ])
    );
    assert.equal(book.dateRead, "2016-07-03T07:00:00.000Z");
    assert.equal(book.userRating, 5);
  });
});

describe("selectShelfBooks", () => {
  it("sorts finished books by user_read_at and falls back to user_date_added", () => {
    const finished = parseGoodreadsRss(
      feed([
        item({
          id: "1",
          title: "Older explicit finish",
          readAt: "Sun, 03 Jul 2016 00:00:00 -0700",
          added: "Thu, 24 Nov 2016 08:11:31 -0800",
        }),
        item({
          id: "2",
          title: "Recently added, unread date",
          added: "Sat, 05 Nov 2022 15:24:40 -0700",
        }),
        item({
          id: "3",
          title: "Middle explicit finish",
          readAt: "Mon, 06 Mar 2017 12:02:40 -0800",
          added: "Mon, 06 Mar 2017 12:02:40 -0800",
        }),
        item({
          id: "4",
          title: "No dates",
        }),
      ])
    );

    const selected = selectShelfBooks([], finished, 3);
    assert.deepEqual(
      selected.map((book) => book.bookId),
      ["2", "3", "1"]
    );
    assert.deepEqual(
      selected.map((book) => book.position),
      [0, 1, 2]
    );
    assert.ok(selected.every((book) => book.shelf === "read"));
  });

  it("drops a book from just-finished when it is still currently reading", () => {
    const current = parseGoodreadsRss(
      feed([
        item({
          id: "9",
          title: "Still open",
          added: "Sat, 05 Nov 2022 15:24:40 -0700",
        }),
      ])
    );
    const finished = parseGoodreadsRss(
      feed([
        item({
          id: "9",
          title: "Still open",
          readAt: "Mon, 06 Mar 2017 12:02:40 -0800",
        }),
        item({
          id: "8",
          title: "Actually finished",
          readAt: "Sun, 03 Jul 2016 00:00:00 -0700",
        }),
      ])
    );

    const selected = selectShelfBooks(current, finished, 3);
    assert.deepEqual(
      selected.map((book) => [book.bookId, book.shelf]),
      [
        ["9", "currently-reading"],
        ["8", "read"],
      ]
    );
  });
});

describe("staleReadingDocIds", () => {
  it("deletes books that left the shelf and keeps the status doc", () => {
    const books = selectShelfBooks(
      parseGoodreadsRss(
        feed([item({ id: "5", title: "Current", added: "Sat, 05 Nov 2022 15:24:40 -0700" })])
      ),
      [],
      3
    );
    assert.deepEqual(
      staleReadingDocIds(["5", "old-book", "status"], books, "status").sort(),
      ["old-book"]
    );
  });
});
