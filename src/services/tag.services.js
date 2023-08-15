import { database } from "../config/firebase.js";
import { get, ref, push, update } from "firebase/database";

/**
 * Transforms the tags document snapshot into an array of tag objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the tags document.
 * @returns {Array} - An array of tag objects.
 */
const fromTagsDocument = snapshot => {
  const tagsDocument = snapshot.val();


  return Object.keys(tagsDocument).map(key => {
    const tag = tagsDocument[key];

    return {
      ...tag,
      id: key,
      createdOn: new Date(tag.createdOn),
    };
  });
}

/**
 * Creates a new tag.
 *
 * @param {string} name - The name of the tag.
 * @returns {Promise<Object>} - A promise that resolves with the created tag object.
 */
export const createTag = async (name) => {
  return push(
    ref(database, 'tags'), {
    name,
    createdOn: Date.now(),
    tagId: null,
  },
  )
    .then(result => {
      const updatePostIDequalToHandle = {};
      updatePostIDequalToHandle[`/tags/${result.key}/tagId`] = result.key;
      update(ref(database), updatePostIDequalToHandle)

      return getTagById(result.key);
    });
}

/**
 * Retrieves a tag by its ID.
 *
 * @param {string} id - The ID of the tag to retrieve.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved tag object.
 */
export const getTagById = async (id) => {

  return get(ref(database, `tags/${id}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Tag with id ${id} does not exist!`);
      }
      const tag = result.val();
      return tag;
    });
};

/**
 * Retrieves all tags.
 *
 * @returns {Promise<Array>} - A promise that resolves with an array of tag objects.
 */
export const getAllTags = async () => {

  return get(ref(database, 'tags'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromTagsDocument(snapshot);
    });
};

/**
 * Updates tags based on a list of new tags.
 *
 * @param {Array<string>} newTags - The list of new tags to update.
 * @returns {void}
 */
export const updateTags = async (newTags) => {
  try {
    const allTags = await getAllTags()
    const allTagsSimpleList = allTags.map(el => el.name);
    const tagsToCreate = newTags.filter(el => !allTagsSimpleList.includes(el));

    tagsToCreate.map(async (el) => {
      try {
        await createTag(el);
      } catch (error) {
        console.log(`Error creating a tag: ${error}`);
      }
    })
  } catch (error) {
    console.log(`Failed to update tags: ${error}`);
  }
}



