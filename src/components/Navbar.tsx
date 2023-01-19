import styles from "./Navbar.module.scss";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles["items-container"]}>
        <Link to="/" className={styles.logo}>
          XITER
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
