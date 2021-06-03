import React from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import api from '../services/api';
import styles from '../styles/home.module.scss';
import { Episode, parseToEpisode } from '../models/Episode';

interface HomeProps {
  latestEpisodes: Episode[],
  allEpisodes: Episode[],
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { data } = await api.get('podcast/');

  const parsedData: Episode[] = data.map(parseToEpisode);
  const episodes = parsedData.sort((a, b) => b.id - a.id);

  return {
    props: {
      latestEpisodes: episodes.slice(0, 2),
      allEpisodes: episodes,
    },
    revalidate: 60 * 2,
  };
};

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.latestEpisodesContainer}>
        <h2>Últimos lançamentos</h2>

        <ul>
          { latestEpisodes.map((episode) => (
            <li key={episode.id}>

              <div className={styles.latestEpisodeThumbnail}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.name}
                />
              </div>

              <div className={styles.episodeDetails}>
                <a href="#">{episode.name}</a>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.timeString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Reproduzir episodio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodesContainer}>
        <h2>Todos episodios</h2>
        <p>{JSON.stringify(allEpisodes)}</p>
      </section>
    </div>
  );
}
