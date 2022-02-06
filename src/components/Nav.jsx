import React from 'react';
import { Link } from 'react-router-dom';

const Nav = function(props) {
  const [state, setState] = React.useState({active: 'Current'});
  return (
      <nav className={props.className + " nav"}>
        <Link 
          onClick={() => {setState({active: 'Current'})}}
          to="/"
          className={"nav__element " + ((state.active === 'Current') ? 'nav__element_active' : '')}>
          Current
        </Link>
        <Link
          onClick={() => {setState({active: 'Playlists'})}}
          to="/playlists"
          className={"nav__element " + ((state.active === 'Playlists') ? 'nav__element_active' : '')}>
          Playlists
        </Link>
        <Link
          onClick={() => {
              if (props.user) setState({active: 'Liked'})
              else (alert('Please log in to use this page'))
            }}
          to={props.user ? "/liked" : "/"}
          className={"nav__element " + ((state.active === 'Liked') ? 'nav__element_active' : '')}>
          Liked
        </Link>
        {/* <div className="nav__active"></div> */}
      </nav>
  );
}

export default Nav;