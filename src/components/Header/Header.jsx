import SearchBar from "../SearchBar/SearchBar";
import NavBar from "../NavBar/NavBar";
import ProfileDropdown from "../Profile-dropdown/Profile-dropdown";
import { Button } from 'react-bootstrap';
import React from "react";
import "./Header.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

    return (
      <div className="container-fluid">
        <div className="row align-items-center bg-light">
          <div className="col-1">
            <img
              id="logo"
              src="https://media.licdn.com/dms/image/C4E0BAQFvwlkUPLXXFA/company-logo_200_200/0/1519889777750?e=2147483647&v=beta&t=WQrfVW3OXacmOCmjiGgmXVN_lQdoxZdbsbEjw7ImHcs"
              alt="Logo"
              style={{ width: '70%', height: 'auto', borderRadius: '15pt' }}
            />
          </div>
          <div className="col-2">
            <NavBar />
          </div>
          <div className="col-6">
            <SearchBar />
          </div>
          <div className="col-1"></div> 
          {/* this is just some empty space */}
          <div className="col-2">
          {user ? (
        <ProfileDropdown />
      ) : (
        <>
          <Button
            type="button"
            style={styles.button1}
            variant="danger"
             onClick={() => navigate('/log-in')}
          >
            Log in
          </Button>
          <Button
            type="button"
            style={styles.button2}
            variant="dark"
            onClick={() => navigate('/sign-up')}
          >
            Sign up
          </Button>
          </>
      )}
          </div>
        </div>
      </div>
    );
  };
  
  const styles = {
    button1: {
      margin: '5px',
      backgroundColor: "#fc004d",
      border: "none"
    },
    button2:{
        margin: '5px',
        border: "none"
    }
  };
  
 export default Header;