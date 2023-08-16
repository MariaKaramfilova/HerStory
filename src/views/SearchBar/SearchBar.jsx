// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Button, FormControl, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { InputGroup } from 'react-bootstrap';
import { ADMIN, BY_TAG, BY_TITLE, POSTS, TAG, USER, USERS_EMAIL, USERS_NAME, USERS_USERNAME } from '../../common/common.js';

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
  const [searchType, setSearchType] = useState(POSTS);
  const [checkType, setCheckType] = useState('by title');
  const navigate = useNavigate();

  /**
   * Handles toggling between searching by title and searching by tag.
   *
   * @function
   */
  const handleClickOnCheck = () => {
    if (checkType === BY_TITLE) {
      setCheckType(BY_TAG);
      setSearchType(TAG);
    } else {
      setCheckType(BY_TITLE);
      setSearchType(POSTS);
    }
  }

  useEffect(() => {
    if (!user) {
      setUserRole(USER);
      return;
    }
    if (loggedInUser) {
      setUserRole(loggedInUser.role);
    }
  }, [loggedInUser, user])

  /**
   * Handles the search button click event.
   *
   * @param {Event} e - The click event.
   * @function
   */
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
          {userRole === ADMIN && (
            <DropdownButton
              variant="outline-secondary"
              title={`Search in ${searchType}`}
              id="input-group-dropdown-1">

              <Dropdown.Item onClick={() => setSearchType(POSTS)} href="#">Posts</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType(USERS_USERNAME)} href="#">Users by username</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType(USERS_EMAIL)} href="#">Users by email</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType(USERS_NAME)} href="#">Users by name</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType(TAG)} href="#">By post tag</Dropdown.Item>

            </DropdownButton>
          )}
          <FormControl
            className="search-bar"
            type="text"
            value={searchTerm}
            name="topic"
            onChange={(e) => { setSearchTerm(e.target.value); setShowError(false) }}
            placeholder={showError ? "Please enter a search term" : searchType === POSTS ? "Enter a topic" : searchType === TAG ? "Enter tag" : "Enter username, email, or display name"}
          />
          {userRole !== ADMIN &&
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
