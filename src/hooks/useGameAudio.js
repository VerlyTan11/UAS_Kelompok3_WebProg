import { useEffect, useRef, useState, useCallback } from "react";

export default function useGameAudio(gameState) {
  const clickSoundRef = useRef(null);
  const backgroundMusicRef = useRef(null);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.6);

  // load audio once
  useEffect(() => {
    // Menggunakan path absolut untuk deployment
    clickSoundRef.current = new Audio("/click.mp3");
    clickSoundRef.current.volume = sfxVolume;

    backgroundMusicRef.current = new Audio("/backsound.mp3");
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = musicVolume;
  }, []);

  // controlled volume update
  useEffect(() => {
    // SFX Volume Control
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = sfxVolume;
    }

    // Music Volume Control
    if (backgroundMusicRef.current) {
      // Atur volume terlebih dahulu
      backgroundMusicRef.current.volume = musicVolume;

      // Jika volume disetel ke 0, pause secara eksplisit
      if (musicVolume === 0) {
        backgroundMusicRef.current.pause();
      }
      // Jika volume > 0 dan game sedang bermain, pastikan musik diputar ulang (jika sebelumnya di-pause)
      else if (musicVolume > 0 && gameState === "playing") {
        // Kita tidak memanggil load() di sini untuk menghindari re-load yang konstan
        // Hanya play() jika sudah diputar (atau sebelumnya di-pause karena volume 0)
        if (backgroundMusicRef.current.paused) {
          backgroundMusicRef.current.play().catch(() => {});
        }
      }
    }
  }, [musicVolume, sfxVolume, gameState]); // Tambahkan gameState ke dependency

  // this MUST be wrapped in useCallback
  const playClick = useCallback(() => {
    if (!clickSoundRef.current || sfxVolume === 0) return; // Mencegah play jika SFX 0
    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play().catch(() => {});
  }, [sfxVolume]); // Tambahkan sfxVolume ke dependency playClick

  // autoplay when game starts
  useEffect(() => {
    if (backgroundMusicRef.current) {
      if (gameState === "playing") {
        // Jika volume musik di atas 0, mainkan
        if (musicVolume > 0) {
          backgroundMusicRef.current.load(); // Load untuk memastikan file siap diputar
          backgroundMusicRef.current.play().catch(() => {});
        }
      } else {
        // Hentikan musik saat berpindah dari halaman game
        backgroundMusicRef.current.pause();
      }
    }
  }, [gameState, musicVolume]); // Tambahkan musicVolume ke dependency

  return {
    playClick,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
  };
}
