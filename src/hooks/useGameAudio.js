import { useEffect, useRef, useState, useCallback } from "react";

export default function useGameAudio(gameState) {
  const clickSoundRef = useRef(null);
  const backgroundMusicRef = useRef(null);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.6);

  // load audio once
  useEffect(() => {
    // FIX 1: Ganti path relatif "../../public/click.mp3" menjadi "/click.mp3"
    clickSoundRef.current = new Audio("/click.mp3");
    clickSoundRef.current.volume = sfxVolume;

    // FIX 2: Ganti path relatif "../../public/backsound.mp3" menjadi "/backsound.mp3"
    backgroundMusicRef.current = new Audio("/backsound.mp3");
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
    // Tambahkan cek apakah backgroundMusicRef.current sudah diinisialisasi
    if (gameState === "playing" && backgroundMusicRef.current) {
      // FIX: Panggil load() sebelum play() di Chrome/Firefox untuk memastikan file dimuat ulang
      backgroundMusicRef.current.load();
      backgroundMusicRef.current.play().catch(() => {});
    } else if (gameState !== "playing" && backgroundMusicRef.current) {
      // Hentikan musik saat berpindah dari halaman game
      backgroundMusicRef.current.pause();
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
