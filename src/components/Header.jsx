import React from 'react';
import {Link} from 'react-router-dom';
import Nav from './Nav.jsx';

const Header = function(props) {
    
    return(
        <header className={props.className + " header"}>
            <div className="header__logo"><span className='header__logo-span'>Antistress </span>player</div>
            <Nav className="header__nav" />
            <button className='header__login btn'>Login</button>
        </header>
    );
}

export default Header;