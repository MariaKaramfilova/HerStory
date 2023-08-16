import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { Card, ListGroup } from "react-bootstrap";
import Posts from "../../components/Posts/Posts.jsx";
import { getUserData } from "../../services/users.services.js";
import { useLocation, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import BlockUserButton from "../BlockUserButton/BlockUserButton.jsx";
import MakeAdminButton from "../MakeAdminButton/MakeAdminButton.jsx";
import Error from "../Error/Error.jsx";
import AccountDetails from "./AccountDetails.jsx";
import { MY_ACCOUNT_PATH } from "../../common/common.js";

/**
 * The MyAccount component displays user account details and their posts.
 *
 * @returns {JSX.Element} - JSX representing the MyAccount component.
 */
export default function MyAccount() {
  const { loggedInUser, user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState("");
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
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    if (!user) {
      return;
    }

    if (location.pathname !== MY_ACCOUNT_PATH) {
      (async function () {
        try {
          const snapshot = await getUserData(userId);
          const userData = snapshot.val(Object.keys(snapshot.val())[0]);
          const userInfo = Object.values(userData).filter(
            (el) => el.uid === userId
          )[0];
          setUserInfo(userInfo);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();

      return;
    } else {
      setUserInfo(loggedInUser);
      setLoading(false);
    }
  }, [loggedInUser, location.pathname, userId]);

  if (error) {
    return <Error error={error} />
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-7">
            {location.pathname === MY_ACCOUNT_PATH && <h1>My Posts</h1>}
            {loading ? (
              <Skeleton
                height={300}
                count={5}
                style={{ marginBottom: "20px" }}
              />
            ) : (
              <Posts userName={userInfo.username} />
            )}
          </div>
          <AccountDetails userInfo={userInfo}/>
        </div>
      </div>
    </>
  );
}
