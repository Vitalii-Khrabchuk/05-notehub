import css from "./SearchBox.module.css";
import { useEffect, useState } from "react";

interface SearchBoxProps {
  onSearch: (word: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [text, setText] = useState("");

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setText(ev.target.value);
  }

  useEffect(() => {
    onSearch(text);
  }, [text, onSearch]);

  return (
    <input
      onChange={handleChange}
      value={text}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}
