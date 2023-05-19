import {
  useRef,
  MutableRefObject,
  useEffect,
  useCallback,
  useState,
  ChangeEvent,
} from "react";
import styles from "./ProgressBar.module.css";
import { formatProgress } from "../../utils/number.utils";

interface IProgressBar {
  animationId: MutableRefObject<number | null>;
  audioEl: HTMLAudioElement | null;
  duration: number;
  isAudioPlaying: boolean;
  isAudioEnded: boolean;
}

function ProgressBar({
  animationId,
  audioEl,
  duration,
  isAudioPlaying,
  isAudioEnded,
}: IProgressBar) {
  const [progress, setProgress] = useState(0);
  const progressEl = useRef<HTMLInputElement | null>(null);
  const intervalId = useRef<number | undefined>(undefined);

  const render = useCallback(() => {
    if (progressEl.current === null) return;
    if (audioEl === null) return;
    progressEl.current.value = audioEl.currentTime.toString();

    animationId.current = window.requestAnimationFrame(render);
  }, [animationId, audioEl]);

  useEffect(() => {
    if (isAudioEnded && progressEl.current) {
      clearInterval(intervalId.current);
      progressEl.current.value = String(0);
      setProgress(0);
    }
  }, [isAudioEnded]);

  useEffect(() => {
    if (isAudioPlaying) {
      render();
      intervalId.current = setInterval(() => {
        if (audioEl) {
          setProgress(audioEl.currentTime);
        }
      }, 1000);
    } else {
      if (animationId.current) {
        window.cancelAnimationFrame(animationId.current);
      }
    }

    return () => {
      if (animationId.current) {
        window.cancelAnimationFrame(animationId.current);
      }
      clearInterval(intervalId.current);
    };
  }, [render, isAudioPlaying, audioEl, animationId]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (audioEl === null) return;
    audioEl.currentTime = +e.target.value;
  }

  return (
    <div className={styles.progressContainer}>
      <span>{formatProgress(progress)}</span>
      <input
        ref={progressEl}
        type="range"
        min={0}
        max={duration}
        onChange={handleChange}
        className={styles.progress}
      />
      <span>{formatProgress(duration)}</span>
    </div>
  );
}

export default ProgressBar;
