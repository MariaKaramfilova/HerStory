// eslint-disable-next-line no-unused-vars
import React from "react";
import AuthenticatedRoute from "../../hoc/AuthenticatedRoute.jsx";
import Search from "./Search.jsx";
import { useMatch } from "react-router-dom";
import { POSTS, TAG } from "../../common/common.js";
import { SEARCH_TYPE_ID_PATH } from "../../common/common.js";

/**
 * The SearchWrapper component is responsible for rendering the Search component based on the route type.
 *
 * @component
 * @returns {JSX.Element} - JSX representing the SearchWrapper component.
 */
export default function SearchWrapper() {
  const match = useMatch(SEARCH_TYPE_ID_PATH);
  const type = match?.params.type;

  if (type !== POSTS && type !== TAG) {
    return (
      <AuthenticatedRoute>
        <Search />
      </AuthenticatedRoute>
    );
  }

  return <Search />;
}
