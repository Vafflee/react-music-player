import React from 'react';
import Nav from './Nav.jsx';

const SignInButton = (props) => {
    return (
        <button className='header__login btn' onClick={() => props.clickHandler()} >Sign in</button>
    )
}

const SignUpButton = (props) => {
    return (
        <button className='header__register btn' onClick={() => props.clickHandler()} >Sign Up</button>
    )
}

const LogOutButton = (props) => {
    return (
        <button className='header__login btn' onClick={() => props.clickHandler()} >Log out</button>
    )
}

const Header = function(props) {
    
    return(
        <header className={props.className + " header"}>
            <div className="header__logo"><span className='header__logo-span'>Antistress </span>player</div>
            <Nav className="header__nav" user={props.user} />
            {
                props.user ? <LogOutButton clickHandler={() => props.logOut()}/> 
                :<div className='header__buttons' ><SignInButton clickHandler={() => props.showLoginWindow('login')}/>
                <SignUpButton clickHandler={() => props.showLoginWindow('register')}/></div> 
            }
        </header>
    );
}

export default Header;