// eslint-disable-next-line no-unused-vars
import React from "react";
import Posts from "../../components/Posts/Posts.jsx";
import { WELCOME_MESSAGE } from "../../common/common.js";
import { HOME_PAGE_MESSAGE } from "../../common/common.js";
/**
 * The Home component displays the home page of the application.
 *
 * @returns {JSX.Element} - JSX representing the Home component.
 */
export default function Home() {
  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <h3>{WELCOME_MESSAGE}</h3>
        <p>{HOME_PAGE_MESSAGE}</p>
      </div>
      <Posts />
    </>
  );
}
