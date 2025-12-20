import { useEffect, useRef, useState, useCallback } from "react";

export default function useGameAudio(gameState) {
  const clickSoundRef = useRef(null);
  const backgroundMusicRef = useRef(null);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.6);

  // === INIT AUDIO (ONCE) ===
  useEffect(() => {
    clickSoundRef.current = new Audio("/click.mp3");
    clickSoundRef.current.volume = sfxVolume;

    backgroundMusicRef.current = new Audio("/backsound.mp3");
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = musicVolume;

    return () => {
      // cleanup
      backgroundMusicRef.current?.pause();
      backgroundMusicRef.current = null;
      clickSoundRef.current = null;
    };
  }, []);

  // === REAL-TIME VOLUME CONTROL ===
  useEffect(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = sfxVolume;
    }

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = musicVolume;

      // mute logic
      if (musicVolume === 0) {
        backgroundMusicRef.current.pause();
      } else if (gameState === "playing" && backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.play().catch(() => {});
      }
    }
  }, [musicVolume, sfxVolume, gameState]);

  // === CLICK SFX ===
  const playClick = useCallback(() => {
    if (!clickSoundRef.current || sfxVolume === 0) return;

    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play().catch(() => {});
  }, [sfxVolume]);

  // === GAME STATE CONTROL ===
  useEffect(() => {
    if (!backgroundMusicRef.current) return;

    if (gameState === "playing") {
      if (musicVolume > 0 && backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.play().catch(() => {});
      }
    } else {
      backgroundMusicRef.current.pause();
    }
  }, [gameState, musicVolume]);

  return {
    playClick,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
  };
}
