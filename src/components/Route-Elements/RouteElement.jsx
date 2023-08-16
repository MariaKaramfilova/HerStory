import Home from "../../views/Home/Home";
import About from "../../views/About/About";
import RegistrationForm from "../SignUp/SignUp";
import Login from "../Login/Login";
import CreatePost from "../CreatePost/CreatePost";
import { Routes, Route } from "react-router-dom";
import AuthModal from "../../hoc/AuthModal.jsx";
import AuthenticatedRoute from "../../hoc/AuthenticatedRoute.jsx";
import SuccessPosting from "../../views/Success-posting/SuccessPosting.jsx";
import ForgottenPassword from "../ResetPassword/ResetPassword";
import AccountSettings from "../Account-Settings/Account-Settings";
import SuccessRegister from "../../views/Success-registrer/SuccessRegister";
import MyAccount from "../../views/Account/Account";
import DetailedPostView from "../../views/DetailedPostView/DetailedPostView";
import UsersDetails from "../Users/UsersDetails.jsx";
import SearchWrapper from "../../views/Search/SearchWrapper.jsx";
import EditPost from "../EditPost/EditPost";
import NotFound from "../../views/NotFound/NotFound.jsx";
import Posts from "../Posts/Posts.jsx"
import { ABOUT_PATH, ACCOUNT_ID_PATH, ACCOUNT_SETTING_PATH, CREATE_POST_PATH, DETAILED_POST_VIEW_ID_PATH, EDIT_POST_ID_PATH, FORGOT_PASSWORD_PATH, HOME_PATH, LOG_IN_PATH, MY_ACCOUNT_PATH, SEARCH_TYPE_ID_PATH, SIGN_UP_PATH, STAR_PATH, SUCCESS_POSTING_PATH, SUCCESS_REGISTER_PATH, TYPE_ID_PATH, USER_ID_PATH } from "../../common/common";

/**
 * Component defining the routing structure for the application.
 *
 * Defines the routing paths and corresponding components for different routes
 * within the application.
 *
 * @component
 * @returns {JSX.Element} Rendered component defining the application's routing.
 * @example
 * return (
 *   <RouteElement />
 * );
 */
export default function RouteElement() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={HOME_PATH} element={<Home />} />
        <Route path={ABOUT_PATH} element={<About />} />
        <Route path={SEARCH_TYPE_ID_PATH} element={<SearchWrapper />} />
        <Route
          path={USER_ID_PATH}
          element={
            <AuthenticatedRoute>
              <UsersDetails />
            </AuthenticatedRoute>
          }
        />
        <Route
          path={SIGN_UP_PATH}
          element={
            <AuthModal>
              <RegistrationForm />
            </AuthModal>
          }
        />
        <Route
          path={LOG_IN_PATH}
          element={
            <AuthModal>
              <Login />
            </AuthModal>
          }
        />
        <Route
          path={FORGOT_PASSWORD_PATH}
          element={
            <AuthModal>
              <ForgottenPassword />
            </AuthModal>
          }
        />
        <Route
          path={CREATE_POST_PATH}
          element={
            <AuthenticatedRoute>
              <CreatePost />
            </AuthenticatedRoute>
          }
        />
        <Route
          path={ACCOUNT_SETTING_PATH}
          element={
            <AuthenticatedRoute>
              <AccountSettings />
            </AuthenticatedRoute>
          }
        />
        <Route
          path={MY_ACCOUNT_PATH}
          element={
            <AuthenticatedRoute>
              <MyAccount />
            </AuthenticatedRoute>
          }
        />
        <Route
          path={ACCOUNT_ID_PATH}
          element={
            <AuthenticatedRoute>
              <MyAccount />
            </AuthenticatedRoute>
          }
        />
        <Route
          path={SUCCESS_POSTING_PATH}
          element={
            <AuthenticatedRoute>
              <SuccessPosting />
            </AuthenticatedRoute>
          }
        />
        <Route
          path={SUCCESS_REGISTER_PATH}
          element={
            <AuthenticatedRoute>
              <SuccessRegister />
            </AuthenticatedRoute>
          }
        />
        <Route path={DETAILED_POST_VIEW_ID_PATH} element={<DetailedPostView />} />
        <Route path={EDIT_POST_ID_PATH} element={<EditPost />} />
        <Route path={TYPE_ID_PATH} element={<Posts />} />
        <Route path={STAR_PATH} element={<NotFound />} />
      </Routes>
    </>
  );
}
