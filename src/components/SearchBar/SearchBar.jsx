import React, { useState } from 'react';
import { Button, FormControl, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm('');
      setShowError(false);
    } else {
      setShowError(true);
    }

  }

  return (
    <>
      <Form style={styles.form}>
        <FormControl
          className="search-bar"
          type="text"
          value={searchTerm}
          name="topic"
          onChange={(e) => {setSearchTerm(e.target.value); setShowError(false)}}
          placeholder={showError ? "Please enter a search term" : "Enter a topic"}
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
