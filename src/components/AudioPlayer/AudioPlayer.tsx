import { ChangeEvent, MutableRefObject } from "react";
import styles from "./AudioPlayer.module.css";
import { ReactComponent as PlayIcon } from "../../assets/play.svg";
import { ReactComponent as PauseIcon } from "../../assets/pause.svg";
import VolumeSlider from "../VolumeSlider/VolumeSlider";
import PannerMenu from "../Menu/PannerMenu/PannerMenu";
import DistortionMenu from "../Menu/DistortionMenu/DistortionMenu";
import FrequencyMenu from "../Menu/FrequencyMenu/FrequencyMenu";
import VisualiserMenu from "../Menu/VisualizerMenu/VisualiserMenu";
import ProgressBar from "../ProgressBar/ProgressBar";

interface IAudioPlayer {
  fileName: string;
  handlePlayPause: () => void;
  isAudioPlaying: boolean;
  audioContext: AudioContext | null;
  distortionNode: WaveShaperNode | null;
  stereoNode: StereoPannerNode | null;
  bassNode: BiquadFilterNode | null;
  midNode: BiquadFilterNode | null;
  trebleNode: BiquadFilterNode | null;
  gainNode: GainNode | null;
  selectedVisualiser: string;
  handleVisualiserChange: (e: ChangeEvent<HTMLInputElement>) => void;
  animationId: MutableRefObject<number | null>;
  audioEl: HTMLAudioElement | null;
  duration: number;
  isAudioEnded: boolean;
}

function AudioPlayer({
  fileName,
  handlePlayPause,
  isAudioPlaying,
  audioContext,
  distortionNode,
  stereoNode,
  bassNode,
  midNode,
  trebleNode,
  gainNode,
  selectedVisualiser,
  handleVisualiserChange,
  animationId,
  audioEl,
  duration,
  isAudioEnded,
}: IAudioPlayer) {
  return (
    <div className={styles.player}>
      <div className={styles.cover} />
      <div className={styles.info}>
        <span className={styles.title}>{fileName}</span>
        <span className={styles.album}> Album Name</span>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={handlePlayPause}
          title={isAudioPlaying ? "Pause" : "Play"}
        >
          {isAudioPlaying ? (
            <PauseIcon className="icon icon__base" />
          ) : (
            <PlayIcon
              style={{ marginLeft: "0.25rem" }}
              className="icon icon__base"
            />
          )}
        </button>
        <div className={styles.controlsRight}>
          <VisualiserMenu
            selectedVisualiser={selectedVisualiser}
            handleVisualiserChange={handleVisualiserChange}
          />
          <FrequencyMenu
            audioContext={audioContext}
            bassNode={bassNode}
            midNode={midNode}
            trebleNode={trebleNode}
          />
          <DistortionMenu distortionNode={distortionNode} />
          <PannerMenu audioContext={audioContext} stereoNode={stereoNode} />
          <VolumeSlider audioContext={audioContext} gainNode={gainNode} />
        </div>
      </div>
      <ProgressBar
        isAudioEnded={isAudioEnded}
        isAudioPlaying={isAudioPlaying}
        duration={duration}
        animationId={animationId}
        audioEl={audioEl}
      />
    </div>
  );
}

export default AudioPlayer;
