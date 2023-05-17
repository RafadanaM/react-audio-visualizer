import { ReactNode, useRef, useState } from "react";
import styles from "./Menu.module.css";
import useOutsideClick from "../../hooks/useOutsideClick";

interface IMenu {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  children?: ReactNode;
  title?: string;
}

const Menu = ({ icon: Icon, children, title }: IMenu) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, () => setIsOpen(false));

  function toggleOpen() {
    setIsOpen((prevState) => !prevState);
  }

  return (
    <div ref={menuRef} className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={toggleOpen} title={title}>
        <Icon className="icon icon__small" />
      </button>
      <div
        className={`${styles.menuContent} ${
          isOpen ? styles.show : styles.hide
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Menu;
