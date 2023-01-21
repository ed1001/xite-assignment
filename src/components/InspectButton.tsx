import styles from "./InspectButton.module.scss";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const InspectButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      inspect &nbsp;
      <MdOutlineKeyboardArrowRight />
    </button>
  );
};

export default InspectButton;
