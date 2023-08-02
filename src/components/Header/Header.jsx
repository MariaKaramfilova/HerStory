import SearchBar from "../SearchBar/SearchBar";
import NavBar from "../NavBar/NavBar";
import ProfileDropdown from "../Profile-dropdown/Profile-dropdown";
import { Button } from 'react-bootstrap';
import "./Header.css";

const Header = () => {
    return (
      <div className="container-fluid">
        <div className="row align-items-center bg-light">
          <div className="col-1">
            <img
              id="logo"
              src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/7a3ec529632909.55fc107b84b8c.png"
              alt="Logo"
              style={{ width: '100%', height: 'auto' }}
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
            <Button
              type="button"
              style={styles.button}
              variant="danger"
              onClick={() => (window.location.href = '/log-in')}
            > Log in </Button>
            <Button
              type="button"
              style={styles.button}
              variant="dark"
              onClick={() => (window.location.href = '/sign-up')}
            > Sign up</Button>
          </div>
        </div>
      </div>
    );
  };
  
  const styles = {
    button: {
      margin: '5px',
    },
  };
  
 export default Header;