import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";
import { IconType } from "react-icons";
import { GoDashboard } from "react-icons/go";
import { BsMusicNoteList, BsMusicNote } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { FaGuitar } from "react-icons/fa";

import styles from "./Sidebar.module.scss";

const sidebarItems = [
  { text: "Dashboard", to: "/", Icon: GoDashboard },
  { text: "Tracks", to: "/tracks", Icon: BsMusicNote },
  { text: "Artists", to: "/artists", Icon: SlPeople },
  { text: "Genres", to: "/genres", Icon: FaGuitar },
  { text: "Playlists", to: "/playlists", Icon: BsMusicNoteList },
];
const Sidebar = () => {
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      <div className={styles["items-container"]}>
        {sidebarItems.map(({ to, text, Icon }) => {
          const active = location.pathname === to;

          return <Item key={text} {...{ to, text, Icon, active }} />;
        })}
      </div>
    </div>
  );
};

const Item = ({
  to,
  text,
  Icon,
  active,
}: {
  to: string;
  text: string;
  Icon: IconType;
  active?: boolean;
}) => {
  return (
    <Link
      to={to}
      className={classnames(styles.item, { [styles.active]: active })}
    >
      <Icon />
      {text}
    </Link>
  );
};

export default Sidebar;
