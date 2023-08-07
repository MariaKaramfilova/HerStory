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
import AccountSettings from "../Account-Settings/Account-Settings"
import SuccessRegister from "../../views/Success-registrer/SuccessRegister"

export default function RouteElement() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search/:id" element={<Search />} />
        <Route path="/sign-up" element={<AuthModal><RegistrationForm /></AuthModal>} />
        <Route path="/log-in" element={<AuthModal><Login /></AuthModal>} />
        <Route path="/create-post" element={<AuthenticatedRoute><CreatePost /></AuthenticatedRoute>} />
        <Route path="/account-settings" element={<AuthenticatedRoute><AccountSettings /></AuthenticatedRoute>} />
        <Route path="/success-posting" element={<AuthenticatedRoute><SuccessPosting /></AuthenticatedRoute>} />
        <Route path="/success-register" element={<AuthenticatedRoute><SuccessRegister /></AuthenticatedRoute>} />

      </Routes>
    </>
  )
}