import moment from 'moment'
import React from 'react'
import MyAccount from '../../views/Account/Account.jsx'

export default function PostsDetails({ goToDetails, ...post }) {

  if (false) {
    return <MyAccount userName={post.userName} />
  }

  return (
    <div>
      {post.author}
      <br />
      {post.title}
      <br />
      {moment(post.createdOn).toString()}
    </div>
  )
}
