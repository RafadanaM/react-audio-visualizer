import { ChangeEvent } from "react";
import styles from "./VisualiserMenu.module.css";
import Menu from "../Menu";
import { ReactComponent as BarLogo } from "../../../assets/bar-chart.svg";

interface IVisualiserMenu {
  selectedVisualiser: string;
  handleVisualiserChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function VisualiserMenu({
  selectedVisualiser,
  handleVisualiserChange,
}: IVisualiserMenu) {
  return (
    <Menu icon={BarLogo} title="Visualiser">
      <div className={styles.selection}>
        <input
          id="line"
          name="line"
          type="radio"
          value="line"
          onChange={handleVisualiserChange}
          checked={selectedVisualiser === "line"}
        />
        <label htmlFor="line">Line</label>
      </div>

      <div className={styles.selection}>
        <input
          id="bar"
          name="bar"
          type="radio"
          value="bar"
          onChange={handleVisualiserChange}
          checked={selectedVisualiser === "bar"}
        />
        <label htmlFor="bar">Bar</label>
      </div>
    </Menu>
  );
}

export default VisualiserMenu;
