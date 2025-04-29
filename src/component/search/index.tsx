import { JSX } from "react";
import "./index.css";

export default function SearchBox(props: any) {
  return <div className="search-div-box">{props?.children}</div>;
}
