import React, { useState } from 'react';
import { Button, FormControl, Form } from 'react-bootstrap';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    //To be implemented
    console.log('Searching for:', searchTerm);
  }

  return (
    <Form onSubmit={handleSearch} style={styles.form}>
      <FormControl
        className="search-bar"
        type="text"
        value={searchTerm}
        name="topic"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter a topic"
      />
      <Button type="submit" variant="dark" style={styles.button}>Search</Button>
    </Form>
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
