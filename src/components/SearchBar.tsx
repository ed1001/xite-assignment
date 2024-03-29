import { ChangeEvent, FormEvent, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import styles from "./SearchBar.module.scss";

const SearchBar = ({
  onSearch,
  searchPlaceholder = "Search",
}: {
  onSearch: (searchTerm: string) => void;
  searchPlaceholder?: string;
}) => {
  const [queryString, setQueryString] = useState<string>("");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(queryString);
  };
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value);
  };

  return (
    <form onSubmit={handleOnSubmit} className={styles.form}>
      <input
        type="text"
        className={styles.input}
        value={queryString}
        onChange={handleOnChange}
        placeholder={searchPlaceholder}
      />
      <RxCross2
        className={styles["cross-icon"]}
        onClick={() => setQueryString("")}
      />
      <AiOutlineSearch className={styles["search-icon"]} />
    </form>
  );
};

export default SearchBar;
