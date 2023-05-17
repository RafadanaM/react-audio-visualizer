import { useState } from "react";
import styles from "./FrequencyMenu.module.css";
import Menu from "../Menu";
import { ReactComponent as FrequencyIcon } from "../../../assets/activity.svg";
import { ReactComponent as RefreshIcon } from "../../../assets/refresh.svg";

interface IFrequencyMenu {
  bassNode: BiquadFilterNode | null;
  midNode: BiquadFilterNode | null;
  trebleNode: BiquadFilterNode | null;
  audioContext: AudioContext | null;
}

function FrequencyMenu({
  bassNode,
  midNode,
  trebleNode,
  audioContext,
}: IFrequencyMenu) {
  const [bassGain, setBassGain] = useState(0);
  const [midGain, setMidGain] = useState(0);
  const [trebleGain, setTrebleGain] = useState(0);

  const handleFreqGain =
    (type: "mid" | "treble" | "bass") => (value: number) => {
      if (bassNode === null) return;
      if (midNode === null) return;
      if (trebleNode === null) return;
      if (audioContext === null) return;

      if (type === "bass") {
        bassNode.gain.setValueAtTime(value, audioContext.currentTime);
        setBassGain(value);
      }

      if (type === "mid") {
        midNode.gain.setValueAtTime(value, audioContext.currentTime);
        setMidGain(value);
      }

      if (type === "treble") {
        trebleNode.gain.setValueAtTime(value, audioContext.currentTime);
        setTrebleGain(value);
      }
    };

  const handleBassGain = handleFreqGain("bass");
  const handleMidGain = handleFreqGain("mid");
  const handleTrebleGain = handleFreqGain("treble");
  return (
    <Menu icon={FrequencyIcon} title="Frequency">
      <>
        <div className={styles.name}>
          <span>Bass</span>
          <RefreshIcon
            onClick={() => handleBassGain(0)}
            className="icon icon__vsmall"
          />
        </div>

        <input
          id="panner"
          type="range"
          onChange={(e) => handleBassGain(+e.target.value)}
          min={-15}
          max={15}
          value={bassGain}
          step={0.01}
        />
        <div className={styles.name}>
          <span>Mid</span>
          <RefreshIcon
            onClick={() => handleMidGain(0)}
            className="icon icon__vsmall"
          />
        </div>

        <input
          id="panner"
          type="range"
          onChange={(e) => handleMidGain(+e.target.value)}
          min={-15}
          max={15}
          value={midGain}
          step={0.01}
        />
        <div className={styles.name}>
          <span>Treble</span>
          <RefreshIcon
            onClick={() => handleTrebleGain(0)}
            className="icon icon__vsmall"
          />
        </div>

        <input
          id="panner"
          type="range"
          onChange={(e) => handleTrebleGain(+e.target.value)}
          min={-15}
          max={15}
          value={trebleGain}
          step={0.01}
        />
      </>
    </Menu>
  );
}

export default FrequencyMenu;
