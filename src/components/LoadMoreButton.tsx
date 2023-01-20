import styles from "./LoadMoreButton.module.scss";
import { PropsWithChildren } from "react";

const LoadMoreButton = ({
  disabled,
  onClick,
  children,
}: PropsWithChildren<{
  disabled: boolean;
  onClick: () => void;
}>) => {
  return (
    <div className={styles.container}>
      <button className={styles.button} disabled={disabled} onClick={onClick}>
        <div className={styles.inner}>{children}</div>
      </button>
    </div>
  );
};

export default LoadMoreButton;