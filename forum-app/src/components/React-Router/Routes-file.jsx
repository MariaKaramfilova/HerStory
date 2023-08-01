import {Routes, Route} from 'react-router-dom';
import Home from '../Home/Home';
import About from '../About/About';

const RoutePage = () => {
    return (
      <div className='main-content'>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
      </div>
    );
};

export default RoutePage