import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { useState } from "react";
import classnames from "classnames";
import styles from "./Inspector.module.scss";

const Inspector = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <section
      className={classnames(styles.content, {
        [styles.closed]: !open,
      })}
    >
      <div className={styles.header}>
        {open && <h1>Inspector</h1>}
        <ToggleOpenButton open={open} toggleOpen={toggleOpen} />
      </div>
      {!open && <h1 className={styles["vertical-header"]}>Inspector</h1>}
    </section>
  );
};

const ToggleOpenButton = ({
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: () => void;
}) => {
  return (
    <button onClick={toggleOpen} className={styles["toggle-open"]}>
      {open ? <TfiArrowCircleRight /> : <TfiArrowCircleLeft />}
    </button>
  );
};

export default Inspector;
