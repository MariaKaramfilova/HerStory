import React from 'react'
import AuthenticatedRoute from '../../hoc/AuthenticatedRoute.jsx';
import Search from './Search.jsx';
import { useMatch } from 'react-router-dom';
import { SEARCH_TYPE_ID_PATH } from '../../common/common.js';

/**
 * The SearchWrapper component is responsible for rendering the Search component based on the route type.
 *
 * @component
 * @returns {JSX.Element} - JSX representing the SearchWrapper component.
 */
export default function SearchWrapper() {
  const match = useMatch(SEARCH_TYPE_ID_PATH);
  const type = match?.params.type;

  if (type !== "posts" && type !== "tag") {
    return (
      <AuthenticatedRoute>
        <Search />
      </AuthenticatedRoute>
    );
  }

  return <Search />;
}
