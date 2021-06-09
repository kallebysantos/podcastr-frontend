import { useContext, useEffect, useRef } from 'react';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Image from 'next/image';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    playNext,
    playPrevious,
    setPlayState,
    isPlaying,
    togglePlay,
    episodeList,
    currentEpisodeIndex,
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    isPlaying
      ? audioRef.current.play()
      : audioRef.current.pause();
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {
        episode
          ? (
            <div className={styles.currentEpisode}>
              <Image
                width={592}
                height={592}
                objectFit="cover"
                src={episode.thumbnail}
              />
              <strong>{episode.name}</strong>
              <span>{episode.members}</span>
            </div>
          )
          : (
            <div className={styles.emptyPlayer}>
              <strong>Selecione um podcast para ouvir</strong>
            </div>
          )
      }

      {
        episode && (
          <audio
            src={episode.audio}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayState(true)}
            onPause={() => setPlayState(false)}
          />
        )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>

          <div className={styles.slider}>
            {
              episode
                ? (
                  <Slider
                    trackStyle={{ backgroundColor: '#04d361' }}
                    railStyle={{ backgroundColor: '#9f75ff' }}
                    handleStyle={{ borderColor: '#9f75ff' }}
                  />
                )
                : (
                  <div className={styles.emptySlider} />
                )
            }
          </div>

          <span>00:00</span>
        </div>

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Reproduzir anterior" />
          </button>

          <button
            type="button"
            disabled={!episode}
            className={styles.playButton}
            onClick={togglePlay}
          >
            {
              isPlaying
                ? <img src="/pause.svg" alt="Reproduzir" />
                : <img src="/play.svg" alt="Reproduzir" />
            }
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Reproduzir proximo" />
          </button>

          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir podcast" />
          </button>
        </div>
      </footer>
    </div>
  );
}
