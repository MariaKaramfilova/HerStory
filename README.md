# HerStory forum app

This project is a Forum System where users can create posts, add comments, and upvote/downvote the things that they like or dislike the most. The forum revolves around one or two general topics.

## Link to the hosted project
<font color="red">Need to update this</font>
(Add link to the hosted project here if it is hosted online)

## Instructions on how to setup and run the project locally
<font color="red">Check at the end of the project</font>
1.  Clone the repository with HTTPS

```
git clone https://gitlab.com/f-ep-group/forum-react.git
```
2.  Install dependencies
```
npm install
```

3.  Run the project

```
npm run preview
```

## Scheme (structure) of the documents in the database

<font color="red">Need to update this</font>
The data is stored in a document (NoSQL) database hosted by Google Firebase. The documents are organized to achieve the functionalities described in the project description.

## Badges
<font color="red">Check what is this and if a must</font>
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

# Features

### Public Part

-   Accessible without authentication
-   Home page presents core features of the platform, number of users and posts created
-   Anonymous users can register and log in
-   Anonymous users can see top 10 most commented posts and 10 most recently created posts

### Private Part

-   Accessible only if the user is authenticated
-   User can log in and log out
-   Users can browse posts created by other users with option to sort and filter them
-   Users can view a single post including its title, content, comments, likes, etc.
-   Users can update their profile information and upload a profile photo
-   Users can create a new post with at least a title and content
-   Users can edit only personal posts or comments
-   Users can view all their or any other user’s posts and comments (with option to filter and sort them)
-   Users can remove one or more of their own posts
-   Users can comment/reply to any other forum post

### Administrative Part

-   Accessible to users with administrative privileges
-   Admin can search for a user by their username, email, or display name
-   Admin can block or unblock individual users
-   Admin can delete any post
-   Admin can view a list of all posts with an option to filter and sort them

### Additional Feature: Post Tags

-   Users can add tags to their posts after creating them. If the tag does not exist, a new one is added to the database. If it exists, it is reused.
-   All tags are lowercase only.
-   Users can find posts by typing in the tag in the search bar.
-   A User can add/remove/edit tags only on its own posts. Admins can add/remove/edit tags on all posts.

## Visuals

<font color="red">Nice to have some images</font>
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Authors and acknowledgment

[Hristiyan Fachikov](https://gitlab.com/hristiyan.fachikov)

[Maria Karamfilova](https://gitlab.com/maria_karamfilova)

[Viktor Petrov](https://gitlab.com/viktor.mp)

## License
Licensed under the terms of the MIT license.
