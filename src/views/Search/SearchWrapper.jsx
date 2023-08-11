import React from 'react'
import AuthenticatedRoute from '../../hoc/AuthenticatedRoute.jsx';
import Search from './Search.jsx';
import { useMatch } from 'react-router-dom';

export default function SearchWrapper() {
  const match = useMatch("/search/:type/:id");
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
