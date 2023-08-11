import { database } from "../config/firebase.js";
import { get, ref, query, orderByChild, equalTo, push, update, remove } from "firebase/database";

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

export const getAllTags = async () => {

  return get(ref(database, 'tags'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromTagsDocument(snapshot);
    });
};

export const updateTags = async (newTags) => {
  try {
    const allTags = await getAllTags()
    const allTagsSimpleList = allTags.map(el => el.name);
    console.log(newTags);
    const tagsToCreate = newTags.filter(el => !allTagsSimpleList.includes(el));

    tagsToCreate.map(async (el) => {
      console.log();
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



