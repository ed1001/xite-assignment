import styles from "./Navbar.module.scss";
import { Link } from "react-router-dom";
import XiteLogo from "../logo.png";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles["items-container"]}>
        <Link to="/" className={styles.logo}>
          <img src={XiteLogo} alt="logo" />
          <div>cms</div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
