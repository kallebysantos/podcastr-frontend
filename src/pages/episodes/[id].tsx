import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Episode, parseToEpisode } from '../../models/Episode';
import api from '../../services/api';
import styles from './styles.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';

interface EpisodeProps {
  episode: Episode,
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<EpisodeProps> = async (ctx) => {
  const { id } = ctx.params;
  const { data } = await api.get(`podcast/${id}`);

  return {
    props: {
      episode: parseToEpisode(data),
    },
  };
};

export default function EpisodePage({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episodeContainer}>
      <Head>
        <title>{episode.name} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          objectFit="cover"
          src={episode.thumbnail}
        />

        <button
          type="button"
          onClick={() => play(episode)}
        >
          <img src="/play.svg" alt="Reproduzir episodio" />
        </button>
      </div>

      <header>
        <h1>{episode.name}</h1>
        <div className={styles.episodeInfo}>
          <span>{episode.members}</span>
          <div>
            <span>{episode.publishedAt}</span>
            <span>{episode.timeString}</span>
          </div>
        </div>
      </header>

      <div className={styles.description}>
        <p>{episode.description}</p>
      </div>
    </div>
  );
}
