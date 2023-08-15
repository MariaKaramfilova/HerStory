import { createContext } from "react"

/**
 * The PostsContext provides a context for managing post data.
 *
 * This context includes an array of all posts and a function to set the posts data.
 *
 * @type {object}
 * @property {Array} allPosts - An array containing all the post data.
 * @property {function} setAllPosts - A function to set the post data in the context.
 *
 * @see {@link https://reactjs.org/docs/context.html | React Context}
 *
 * @example
 * import { createContext, useContext } from "react";
 *
 * const PostsContext = createContext({
 *   allPosts: [],
 *   setAllPosts: () => [],
 * });
 *
 * export default PostsContext;
 *
 * // In a component, you can use the PostsContext like this:
 * const { allPosts, setAllPosts } = useContext(PostsContext);
 */
export const PostsContext = createContext({
    allPosts: [],
    setAllPosts: () => [],
});