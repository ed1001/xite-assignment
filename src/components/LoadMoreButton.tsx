import styles from "./LoadMoreButton.module.scss";
import { PropsWithChildren } from "react";
import { CgSpinner } from "react-icons/cg";

const LoadMoreButton = ({
  disabled,
  onClick,
  isFetchingNextPage,
  children,
}: PropsWithChildren<{
  disabled: boolean;
  onClick: () => void;
  isFetchingNextPage?: boolean;
}>) => {
  return (
    <div className={styles.container}>
      <button className={styles.button} disabled={disabled} onClick={onClick}>
        <div className={styles.inner}>
          {isFetchingNextPage ? <CgSpinner /> : children}
        </div>
      </button>
    </div>
  );
};

export default LoadMoreButton;
