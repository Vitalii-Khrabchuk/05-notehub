import css from "./Error.module.css";

interface ErrorProps {
  mess: string;
}

export default function Error({ mess }: ErrorProps) {
  return <p className={css.content}>{mess}</p>;
}
