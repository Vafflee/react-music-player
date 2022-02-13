import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = function(props) {
  const [state, setState] = React.useState({active: ''});
  
  // React.useEffect(() => {
  //   if (window.location.href.split('/')[window.location.href.split('/').length - 1] != state.active) {
  //     let page = 'current';
  //     if (window.location.href.split('/')[window.location.href.split('/').length - 1] == 'playlists') page = 'playlists';
  //     if (window.location.href.split('/')[window.location.href.split('/').length - 1] == 'liked') page = 'liked';
  //     setState({active: page});
  //   }
  // });

  return (
      <nav className={props.className + " nav"}>
        <NavLink 
          // onClick={() => {setState({active: ''})}}
          to="/"
          className={({ isActive }) => ("nav__element " + (isActive ? 'nav__element_active' : ''))}
        >
          Current
        </NavLink>
        <NavLink
          // onClick={() => {setState({active: 'playlists'})}}
          to="/playlists"
          className={({ isActive }) => ("nav__element " + (isActive ? 'nav__element_active' : ''))}
        >
          Playlists
        </NavLink>
        <NavLink
          onClick={() => {
              if (!props.loggedIn) alert('Please log in to use this page');
            }}
          to={"/liked"}
          className={({ isActive }) => ("nav__element " + (isActive ? 'nav__element_active' : ''))}
        >
          Liked
        </NavLink>
        {/* <div className="nav__active"></div> */}
      </nav>
  );
}

export default Nav;