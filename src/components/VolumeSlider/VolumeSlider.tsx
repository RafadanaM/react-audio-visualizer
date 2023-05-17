import { ChangeEvent, useRef, useState } from "react";
import styles from "./VolumeSlider.module.css";
import { ReactComponent as VolumeIcon } from "../../assets/volume.svg";
import { ReactComponent as VolumeMuteIcon } from "../../assets/volume-x.svg";

interface IVolumeSlider {
  gainNode: GainNode | null;
  audioContext: AudioContext | null;
}

function VolumeSlider({ gainNode, audioContext }: IVolumeSlider) {
  const [volume, setVolume] = useState(0.25);
  const lastVolume = useRef<number>(0);

  function handleAudioVolume(e: ChangeEvent<HTMLInputElement>) {
    if (audioContext && gainNode) {
      gainNode.gain.setValueAtTime(+e.target.value, audioContext.currentTime);
      setVolume(+e.target.value);
    }
  }

  function handleMute() {
    if (audioContext === null) return;
    if (gainNode === null) return;
    if (volume > 0) {
      lastVolume.current = volume;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      setVolume(0);
    } else {
      gainNode.gain.setValueAtTime(
        lastVolume.current,
        audioContext.currentTime
      );
      setVolume(lastVolume.current);
    }
  }

  return (
    <div className={styles.volumeContainer}>
      <button type="button" onClick={handleMute} title="Volume">
        {volume > 0 ? (
          <VolumeIcon className="icon icon__small" />
        ) : (
          <VolumeMuteIcon className="icon icon__small" />
        )}
      </button>
      <input
        id="volume"
        type="range"
        onChange={handleAudioVolume}
        min={0}
        max={0.5}
        value={volume}
        step={0.01}
      />
    </div>
  );
}

export default VolumeSlider;
