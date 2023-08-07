import moment from 'moment'
import React from 'react'

export default function PostsDetails({ goToDetails, ...post }) {

  return (
    <div>
      {post.title}
      <br />
      {moment(post.createdOn).toString()}
    </div>
  )
}
