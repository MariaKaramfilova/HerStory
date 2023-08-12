import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { Card, ListGroup } from 'react-bootstrap'
import Posts from '../../components/Posts/Posts.jsx';
import { getUserData } from '../../services/users.services.js';
import { useLocation, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import BlockUserButton from '../../components/BlockUserButton/BlockUserButton.jsx';
import MakeAdminButton from '../../components/MakeAdminButton/MakeAdminButton.jsx';

export default function MyAccount() {

  const { loggedInUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState('');
  const location = useLocation();
  const params = useParams();
  const userId = params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Entry points:
   * admin view another user with /account/uid (navigate) - get Uid from url
   * menu dropdown - my-account (navigate) - get uid from current user context
   * Post-details - view another person or own account with /account/uid
   */
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!loggedInUser) {
      return;
    }

    if (location.pathname !== '/my-account') {
      getUserData(userId)
        .then(snapshot => {
          const userData = snapshot.val(Object.keys(snapshot.val())[0]);
          const userInfo = Object.values(userData).filter(el => el.uid === userId)[0];
          setUserInfo(userInfo);
        })
        .catch(err => setError(err))
        .finally(() => setLoading(false));
      return;
    } else {
      setUserInfo(loggedInUser);
      setLoading(false);

    }

  }, [loggedInUser, location.pathname, userId]);

  // Need to fix this with error pages - check for lib
  if (error) {
    return <h1>Error!!! {error.message}</h1>
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">

          <div className="col-7">
            {location.pathname === '/my-account' && <h1>My Posts</h1>}
            {loading ? <Skeleton height={300} count={5} style={{ marginBottom: "20px" }} /> : <Posts userName={userInfo.username} />}
          </div>

          <div className="col-auto">
            <h1>Account Details</h1>
            {loggedInUser && (
              <Card>
                <Card.Body>
                  <Card.Title>{userInfo.username}</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Email: {userInfo.email}</ListGroup.Item>
                    <ListGroup.Item>First Name: {userInfo.firstName}</ListGroup.Item>
                    <ListGroup.Item>Last Name: {userInfo.lastName}</ListGroup.Item>
                    {/* If the createdOn is a timestamp, you can format it accordingly */}
                    <ListGroup.Item>
                      Created On: {new Date(userInfo.createdOn).toLocaleString()}
                    </ListGroup.Item>
                  </ListGroup>
                  {loggedInUser.role === 'admin' &&
                    <>
                      <BlockUserButton user={userInfo} />
                      <MakeAdminButton user={userInfo} />
                    </>
                  }
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )

}
