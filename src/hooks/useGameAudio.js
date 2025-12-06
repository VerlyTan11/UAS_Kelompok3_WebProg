import { useEffect, useRef, useState, useCallback } from "react";

export default function useGameAudio(gameState) {
  const clickSoundRef = useRef(null);
  const backgroundMusicRef = useRef(null);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.6);

  // load audio once
  useEffect(() => {
    clickSoundRef.current = new Audio("../../public/click.mp3");
    clickSoundRef.current.volume = sfxVolume;

    backgroundMusicRef.current = new Audio("../../public/backsound.mp3");
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = musicVolume;
  }, []);

  // controlled volume update
  useEffect(() => {
    if (clickSoundRef.current) clickSoundRef.current.volume = sfxVolume;
    if (backgroundMusicRef.current)
      backgroundMusicRef.current.volume = musicVolume;
  }, [musicVolume, sfxVolume]);

  // this MUST be wrapped in useCallback
  const playClick = useCallback(() => {
    if (!clickSoundRef.current) return;
    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play().catch(() => {});
  }, []);

  // autoplay when game starts
  useEffect(() => {
    if (gameState === "playing" && backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(() => {});
    }
  }, [gameState]);

  return {
    playClick,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
  };
}
