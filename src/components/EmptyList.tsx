import styles from "./EmptyList.module.scss";
import { TbMoodEmpty } from "react-icons/tb";
import { EntityType } from "../types";

const EmptyList = ({
  searchTerm,
  type,
}: {
  searchTerm: string;
  type: EntityType;
}) => {
  return (
    <div className={styles.container}>
      <TbMoodEmpty />
      {searchTerm ? (
        <p>No results found for &quot;{searchTerm}&quot;</p>
      ) : (
        <p>No {type}s yet</p>
      )}
    </div>
  );
};

export default EmptyList;
