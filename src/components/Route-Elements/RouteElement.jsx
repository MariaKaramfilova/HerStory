import Home from "../../views/Home/Home"
import About from "../../views/About/About"
import RegistrationForm from "../SignUp/SignUp"
import Login from "../Login/Login"
import CreatePost from "../CreatePost/CreatePost"
import { Routes, Route } from 'react-router-dom';
import AuthModal from "../Modal/AuthModal.jsx"
import AuthenticatedRoute from "../../hoc/AuthenticatedRoute.jsx"
import SuccessPosting from "../../views/Success-posting/SuccessPosting.jsx"
import Search from "../../views/Search/Search.jsx"
import ForgottenPassword from "../ResetPassword/ResetPassword"
import AccountSettings from "../Account-Settings/Account-Settings"
import SuccessRegister from "../../views/Success-registrer/SuccessRegister"
import MyAccount from "../../views/Account/Account"
import DetailedPostView from "../../views/DetailedPostView/DetailedPostView"
import UsersDetails from "../Users/UsersDetails.jsx"
import SearchWrapper from "../../views/Search/SearchWrapper.jsx"

export default function RouteElement() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search/:type/:id" element={<SearchWrapper />} />
        <Route path="/users/:id" element={<AuthenticatedRoute><UsersDetails /></AuthenticatedRoute>} />
        <Route path="/sign-up" element={<AuthModal><RegistrationForm /></AuthModal>} />
        <Route path="/log-in" element={<AuthModal><Login /></AuthModal>} />
        <Route path="/forgot-password" element={<AuthModal><ForgottenPassword /></AuthModal>} />
        <Route path="/create-post" element={<AuthenticatedRoute><CreatePost /></AuthenticatedRoute>} />
        <Route path="/account-settings" element={<AuthenticatedRoute><AccountSettings /></AuthenticatedRoute>} />
        <Route path="/my-account" element={<AuthenticatedRoute><MyAccount /></AuthenticatedRoute>} />
        <Route path="/account/:id" element={<AuthenticatedRoute><MyAccount /></AuthenticatedRoute>} />
        <Route path="/success-posting" element={<AuthenticatedRoute><SuccessPosting /></AuthenticatedRoute>} />
        <Route path="/success-register" element={<AuthenticatedRoute><SuccessRegister /></AuthenticatedRoute>} />
        <Route path="/detailed-post-view" element={<DetailedPostView />} />

      </Routes>
    </>
  )
}