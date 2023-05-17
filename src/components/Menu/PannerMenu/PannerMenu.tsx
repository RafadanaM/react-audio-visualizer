import { useState } from "react";
import styles from "./PannerMenu.module.css";
import Menu from "../Menu";
import { ReactComponent as HeadphoneIcon } from "../../../assets/headphones.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";

interface IPannerMenu {
  audioContext: AudioContext | null;
  stereoNode: StereoPannerNode | null;
}

function PannerMenu({ audioContext, stereoNode }: IPannerMenu) {
  const [pan, setPan] = useState(0);

  function handleAudioStereoPan(value: number) {
    if (stereoNode && audioContext) {
      stereoNode.pan.setValueAtTime(value, audioContext.currentTime);
      setPan(value);
    }
  }

  return (
    <Menu icon={HeadphoneIcon} title="Stereo Pan">
      <>
        <RefreshIcon
          onClick={() => handleAudioStereoPan(0)}
          className={`icon icon__vsmall ${styles.reset}`}
        />
        <div className={styles.pannerMenuSlider}>
          <span>L</span>
          <input
            id="panner"
            type="range"
            onChange={(e) => handleAudioStereoPan(+e.target.value)}
            min={-1}
            max={1}
            value={pan}
            step={0.01}
          />
          <span>R</span>
        </div>
        <div className={styles.pannerMenuIndicator}>
          <span className={styles.percentage}>{(pan * 100).toFixed(0)}%</span>
        </div>
      </>
    </Menu>
  );
}

export default PannerMenu;
