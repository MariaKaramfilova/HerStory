import Home from "../../views/Home/Home"
import About from "../../views/About/About"
import RegistrationForm from "../SignUp/SignUp"
import Login from "../Login/Login"
import CreatePost from "../CreatePost/CreatePost"
import {Routes, Route} from 'react-router-dom';
import { auth } from "../../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth';

export default function RouteElement() {
    const [user] = useAuthState(auth);

    return (
    <>
        <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<RegistrationForm />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/log-in" element={<Login />} />
          {user === null ? (<Route path="/log-in" element={<CreatePost />} ></Route>)
          :(<Route path="/create-post" element={<CreatePost />} ></Route>)}
        </Routes>
    </>
    )
}