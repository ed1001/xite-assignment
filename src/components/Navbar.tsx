import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import XiteLogo from "../logo.png";
import { clearAllData } from "../react-query/persister";
import { FaTrashAlt } from "react-icons/fa";
import React from "react";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles["items-container"]}>
        <Link to="/" className={styles.logo}>
          <img src={XiteLogo} alt="logo" />
          <div>cms</div>
        </Link>
        <FaTrashAlt onClick={clearAllData} title={"clear all data"} />
      </div>
    </nav>
  );
};

export default Navbar;
