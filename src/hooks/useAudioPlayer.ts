import { useState, useRef, useEffect, useCallback } from "react";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("durationchange", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => setIsPlaying(false));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("play", () => setIsPlaying(true));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const load = useCallback((src: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return { isPlaying, currentTime, duration, load, play, pause, seek, togglePlay };
}
