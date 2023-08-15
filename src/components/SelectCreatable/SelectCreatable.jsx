import React, { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { getAllTags } from '../../services/tag.services.js';
import { getPostsByAuthor } from '../../services/post.services.js';
import PropTypes from "prop-types";
import Error from '../../views/Error/Error.jsx';

export default function SelectCreatable({ changeTags, post }) {
  const animatedComponents = makeAnimated();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState([]);
  const [allTags, setAllTags] = useState();
  const [defaultTags, setDefaultTags] = useState();

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const data = await getPostsByAuthor(post.author);
        const filterValidTags = Object.entries(
          data.filter((el) => el.postId === post.postId)[0].tags
        );
        const defaultTagsList = filterValidTags.map((el) => createOption(el[0]));
        setDefaultTags(defaultTagsList);
        setValue(defaultTagsList);
        changeTags(defaultTagsList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();

    (async function () {
      try {
        const data = await getAllTags();
        const arr = [];
        data.map((tag) => {
          return arr.push({ value: tag.name, label: tag.name });
        });
        setAllTags(arr);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return;
  }

  return (
    <CreatableSelect
      cacheOptions
      defaultOptions
      defaultValue={defaultTags}
      inputValue={inputValue}
      onChange={(newValue) => { setValue(newValue); changeTags([newValue, defaultTags]) }}
      onInputChange={(newValue) => setInputValue(newValue.toLowerCase())}
      isClearable
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={allTags}
    />
  )
}

SelectCreatable.propTypes = {
  changeTags: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
