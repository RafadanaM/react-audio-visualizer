import { useState, ChangeEvent } from "react";
import styles from "./DistortionMenu.module.css";
import { ReactComponent as DistortionLogo } from "../../../assets/broadcast.svg";
import Menu from "../Menu";

interface IDistortionMenu {
  distortionNode: WaveShaperNode | null;
}

function DistortionMenu({ distortionNode }: IDistortionMenu) {
  const [distortion, setDistortion] = useState(0);

  function makeDistortionCurve(amount = 50) {
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;

    for (let i = 0; i < nSamples; i++) {
      const x = (i * 2) / nSamples - 1;
      curve[i] =
        ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  function handleAudioDistortion(e: ChangeEvent<HTMLInputElement>) {
    if (distortionNode === null) return;
    if (+e.target.value === 0) {
      distortionNode.oversample = "none";
      distortionNode.curve = null;
    } else {
      distortionNode.oversample = "4x";
      distortionNode.curve = makeDistortionCurve(+e.currentTarget.value);
    }
    setDistortion(+e.target.value);
  }

  return (
    <Menu icon={DistortionLogo} title="Distortion">
      <>
        <input
          id="panner"
          type="range"
          onChange={handleAudioDistortion}
          min={0}
          max={200}
          value={distortion}
          step={1}
        />
        <span className={styles.percentage}>{distortion}%</span>
      </>
    </Menu>
  );
}

export default DistortionMenu;
