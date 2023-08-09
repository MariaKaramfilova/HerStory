import React, { useContext, useEffect, useState } from 'react';
import { Button, FormControl, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { getUserData } from '../../services/users.services.js';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState('');
  const [searchType, setSearchType] = useState('posts');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setUserRole('user');
      return;
    }
    getUserData(user.uid)
      .then(snapshot => {
        const userData = snapshot.val(Object.keys(snapshot.val())[0]);
        const userInfo = Object.values(userData).filter(el => el.uid === user.uid)[0].role;
        setUserRole(userInfo);
      });
  }, [user])

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
        {userRole === 'admin' && (
          <Form.Select style={{ width: '10em' }} onChange={(e) => setSearchType(e.target.value)}>
            <option value='posts'>Posts query</option>
            <option value='users-username'>Users by username</option>
            <option value='users-email'>Users by email</option>
            <option value='users-name'>Users by name</option>
          </Form.Select>
        )}
        <FormControl
          className="search-bar"
          type="text"
          value={searchTerm}
          name="topic"
          onChange={(e) => { setSearchTerm(e.target.value); setShowError(false) }}
          placeholder={showError ? "Please enter a search term" : searchType === 'posts' ? "Enter a topic" : "Enter username, email, or display name"}
        />
        <Button type="submit" variant="dark" onClick={handleSearchClick} style={styles.button}>Search</Button>
      </Form>
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
