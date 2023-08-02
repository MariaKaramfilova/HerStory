import {Routes, Route} from 'react-router-dom';
import Home from '../../views/Home/Home';
import About from '../../views/About/About';
import CreatePost from '../CreatePost/CreatePost.jsx';
import React from 'react';

const RoutePage = () => {
    return (
      <div className='main-content'>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </div>
    );
};

export default RoutePage