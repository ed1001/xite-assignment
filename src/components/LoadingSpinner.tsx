import styles from "./Loading.module.scss";

const LoadingSpinner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader} />
    </div>
  );
};

export default LoadingSpinner;
