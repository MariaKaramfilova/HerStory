import React, { useContext, useEffect, useState } from 'react';
import { Button, FormControl, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { InputGroup } from 'react-bootstrap';

/**
 * The SearchBar component provides a search bar with various options for searching content.
 *
 * @component
 * @returns {JSX.Element} - JSX representing the SearchBar component.
 */
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const { loggedInUser, user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState('');
  const [searchType, setSearchType] = useState('posts');
  const [checkType, setCheckType] = useState('by title');
  const navigate = useNavigate();

  const handleClickOnCheck = () => {
    if (checkType === 'by title') {
      setCheckType("by tag");
      setSearchType("tag");
    } else {
      setCheckType("by title");
      setSearchType("posts");
    }
  }

  useEffect(() => {
    if (!user) {
      setUserRole('user');
      return;
    }
    if (loggedInUser) {
      setUserRole(loggedInUser.role);
    }
  }, [loggedInUser, user])

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchType}/${searchTerm}`);
      setSearchTerm('');
      setShowError(false);
    } else {
      setShowError(true);
    }

  }

  return (
    <>
      <Form style={styles.form}>
        <InputGroup>
          {userRole === 'admin' && (
            <DropdownButton
              variant="outline-secondary"
              title={`Search in ${searchType}`}
              id="input-group-dropdown-1">

              <Dropdown.Item onClick={() => setSearchType("posts")} href="#">Posts</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("users-username")} href="#">Users by username</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("users-email")} href="#">Users by email</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("users-name")} href="#">Users by name</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType("tag")} href="#">By post tag</Dropdown.Item>

            </DropdownButton>
          )}
          <FormControl
            className="search-bar"
            type="text"
            value={searchTerm}
            name="topic"
            onChange={(e) => { setSearchTerm(e.target.value); setShowError(false) }}
            placeholder={showError ? "Please enter a search term" : searchType === 'posts' ? "Enter a topic" : searchType === "tag" ? "Enter tag" : "Enter username, email, or display name"}
          />
          {userRole !== 'admin' &&
            <Form.Check
              style={{position: 'absolute', right: '1em', verticalAlign: "baseline", marginTop: "0.4em", zIndex: "10"}}
              type="switch"
              id="custom-switch"
              label={checkType}
              onClick={handleClickOnCheck}
            />}
        </InputGroup>
        <Button type="submit" variant="dark" onClick={handleSearchClick} style={styles.button}>Search</Button>
      </Form >
    </>
  );
};

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '3%',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',

  },
  button: {
    margin: "15px",
  }


};

export default SearchBar;
