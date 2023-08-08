import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { Card, ListGroup } from 'react-bootstrap'
import Posts from '../../components/Posts/Posts.jsx';
import { getUserData } from '../../services/users.services.js';


export default function MyAccount({ userName }) {

  const { user } = useContext(AuthContext);

  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }

  //   getUserData(user.uid)
  //     .then(snapshot => {
  //       const userData = snapshot.val(Object.keys(snapshot.val())[0]);
  //       const userInfo = Object.values(userData).filter(el => el.uid === user.uid)[0].username;
  //       setUserName(userInfo);
  //     });
  // }, [user])

  return (
    <>
      <div className="container-fluid">
        <div className="row">

          <div className="col-7">
            <h1>My Posts</h1>
            <Posts userName={userName || 'logged'} />
          </div>

          <div className="col-auto">
            <h1>Account Details</h1>
            {user && (
              <Card>
                <Card.Body>
                  <Card.Title>{user.username}</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                    <ListGroup.Item>First Name: {user.firstName}</ListGroup.Item>
                    <ListGroup.Item>Last Name: {user.lastName}</ListGroup.Item>
                    {/* If the createdOn is a timestamp, you can format it accordingly */}
                    <ListGroup.Item>
                      Created On: {new Date(user.createdOn).toLocaleString()}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )

}

// MyAccount.propTypes = {
//     uid: PropTypes.string,
//   };