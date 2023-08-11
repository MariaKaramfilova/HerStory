import React, { useContext, useEffect, useState } from 'react';
import { Button, FormControl, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { getUserData } from '../../services/users.services.js';
import { InputGroup } from 'react-bootstrap';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const [userRole, setUserRole] = useState('');
  const [searchType, setSearchType] = useState('posts');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      setUserRole('user');
      return;
    }
    setUserRole(loggedInUser.role);
  }, [loggedInUser])

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

            </DropdownButton>
          )}
          <FormControl
            className="search-bar"
            type="text"
            value={searchTerm}
            name="topic"
            onChange={(e) => { setSearchTerm(e.target.value); setShowError(false) }}
            placeholder={showError ? "Please enter a search term" : searchType === 'posts' ? "Enter a topic" : "Enter username, email, or display name"}
          />
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
