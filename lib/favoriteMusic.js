export const favoriteAlbums = [
  {
    spotifyId: "76290XdXVF9rPzGdNRWdCh",
    title: "Ctrl",
    artist: "SZA",
    year: 2017,
  },
  {
    spotifyId: "1BZoqf8Zje5nGdwZhOjAtD",
    title: "The Miseducation of Lauryn Hill",
    artist: "Lauryn Hill",
    year: 1998,
  },
  {
    spotifyId: "5wtE5aLX5r7jOosmPhJhhk",
    title: "Swimming",
    artist: "Mac Miller",
    year: 2018,
  },
  {
    spotifyId: "3mVCQqgwEvwD7lHy9KHi7R",
    title: "...Nothing Like The Sun",
    artist: "Sting",
    year: 1987,
  },
  {
    spotifyId: "7xV2TzoaVc0ycW7fwBwAml",
    title: "Fine Line",
    artist: "Harry Styles",
    year: 2019,
  },
  {
    spotifyId: "4VFG1DOuTeDMBjBLZT7hCK",
    title: "Malibu",
    artist: "Anderson .Paak",
    year: 2016,
  },
];

export function spotifyEmbedUrl(spotifyId) {
  return `https://open.spotify.com/embed/album/${spotifyId}?utm_source=generator`;
}

export function spotifyAlbumUrl(spotifyId) {
  return `https://open.spotify.com/album/${spotifyId}`;
}
