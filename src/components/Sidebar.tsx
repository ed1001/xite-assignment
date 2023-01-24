import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";
import { IconType } from "react-icons";
import { BsMusicNote, BsMusicNoteList } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { FaGuitar } from "react-icons/fa";

import styles from "./Sidebar.module.scss";

const sidebarItems = [
  { text: "Tracks", to: "/tracks", Icon: BsMusicNote },
  { text: "Playlists", to: "/playlists", Icon: BsMusicNoteList },
  { text: "Artists", to: "/artists", Icon: SlPeople },
  { text: "Genres", to: "/genres", Icon: FaGuitar },
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
      <p>{text}</p>
    </Link>
  );
};

export default Sidebar;
