import React from "react";
import styles from "../styles/musicplayer.module.css";
import { favoriteAlbums, spotifyEmbedUrl } from "../lib/favoriteMusic";

const SpotifyEmbed = () => {
  return (
    <div>
      {favoriteAlbums.map((album) => (
        <iframe
          key={album.spotifyId}
          className={styles.spotifyEmbed}
          src={spotifyEmbedUrl(album.spotifyId)}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${album.title} by ${album.artist}`}
        />
      ))}
    </div>
  );
};

export default SpotifyEmbed;
