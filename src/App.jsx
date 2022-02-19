import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
// import { Redirect } from 'react-router';
import Admin from './components/Admin.jsx';
import Player from './components/Player.jsx';
import Header from './components/Header.jsx';
import SignWindow from './components/SignWindow.jsx';
import Current from './components/Current.jsx';
import Liked from './components/Liked.jsx';
import config from './config/config.js';
import Playlists from "./components/Playlists.jsx";


export default class App extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      loginWindowShown: null,

      user: null,
      userInfo: null,
      loggedIn: false,

      playlist: null,
      originalPlaylist: null,
      currentSong: null,
      currentIndex: 0,
      
      isPlaying: false,
      currentTime: 0,
      fullTime: 0,
      
      shuffle: false,
      repeat: false
    };
    this.playerRef = null;
  }

  async getPlaylist(playlistid) {
    const response = await fetch(config.url + '/api/playlists/' + playlistid);
    if (response.status != 200) return alert('Fetch error');
    const songlist = await response.json();

    // console.log(songlist);
    const promises = [];
    songlist.songs.forEach( songId => {
      promises.push(
        fetch(config.url + '/api/songs/' + songId)
          .then(res => res.json())
      );
    });

    Promise.all(promises) // Wait for results of all fetch requests
      .then(playlist => {
        console.log("Got a playlist");
        // console.log(playlist);
        this.setPlaylist(playlist, songlist.name, 0);
      });
  }

  async userFromLocalStorage() {
    if (!localStorage.user) return;
    
    let user = null;
    let loggedIn = false;
    try {
      user = localStorage.user ? JSON.parse(localStorage.user) : null;
      if (!await this.verifyUser(user.accessToken)) {
        console.log('Invalid user');
        localStorage.user = '';
        return;
      }
      loggedIn = true;
      // console.log(await this.verifyUser(user.accessToken))
    } catch (err) {
      console.log('Can not parse user from localStorage: ' + err.message);
      localStorage.user = '';
      return;
    }
    
    this.setState({user: user, loggedIn: loggedIn}, () => {
      console.log('User restored from localStorage');
      this.getUserInfo();
    });
  }

  getUserInfo() {
    // console.log(this.state.user)
    fetch(config.url + '/api/user', {
      headers: {
        'x-access-token': this.state.user.accessToken
      }
    })
    .then(res => res.json())
    .then(info => {
      console.log('Got info about ' + info.user.login);
      this.setState({userInfo: info.user});
    })
    .catch(err => console.log(err));
  }

  encodeXForm(details) {
    let formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
  }

  likeSong(songId) {
    // console.log(songId);
    if (!this.state.user) return alert('Please sign in to like songs');
    console.log({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-access-token': this.state.user.accessToken
      },
      body: this.encodeXForm({songid: songId})
    });
    fetch(config.url + '/api/user/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-access-token': this.state.user.accessToken
      },
      body: this.encodeXForm({songid: songId})
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      this.getUserInfo();
    })
    .catch(err => console.log(err));
  }

  componentDidMount() {
    this.userFromLocalStorage();
    this.getPlaylist('620f68dbe405cc228a640c14');
    this.playerRef.addEventListener('timeupdate', () => this.timeUpdate());
    this.playerRef.addEventListener('durationchange', () => this.updateInfo());
    this.playerRef.addEventListener('ended', () => this.nextSong());
  }

  async verifyUser(token) {
    const verified = await fetch(config.url + '/api/auth/verifyuser', {
      method: "POST",
      headers: {
        'x-access-token': token
      }
    })
    .then(res => res.json())
    .then(json => {
      return json.message === 'verified';
    })
    .catch(err => console.log(err));
    
    console.log('User verified');
    return verified;
  }

  updateInfo() {
    this.setState({
        currentTime: this.playerRef.currentTime,
        fullTime: this.playerRef.duration
    });
  }

  timeUpdate() {
    this.setState({
        currentTime: this.playerRef.currentTime
    });
  }
  
  setCurrentTime(timeInPercent) {
    this.playerRef.currentTime = this.state.fullTime * timeInPercent / 100;
  }

  async changeSong(index) {
    if (!this.state.playlist.current[index]) {
      console.log('No song: ' + this.state.playlist.current[index]);
      return;
    }
    this.playerRef.src = `${config.url}/songfile/${this.state.playlist.current[index]._id}`;
    this.playerRef.load();
    const song = await (await fetch(config.url + '/api/songs/' + this.state.playlist.current[index]._id)).json();
    this.setState({currentSong: song, currentIndex: index});
    
    if (this.state.isPlaying) {
      this.playerRef.play();
    }

    console.log('Song changed to ' + index);
  }

  nextSong() {
    const number = this.state.currentIndex + 1;
    if (number < this.state.playlist.current.length) { 
      this.changeSong(number);
    }
    else if (this.state.repeat) {
      this.changeSong(0);
    }
  }

  prevSong() {
    const number = this.state.currentIndex - 1;
    if (number >= 0) { 
      this.changeSong(number);
    }
    else if (this.state.repeat) {
      this.changeSong(this.state.playlist.current.length - 1);
    }
  }

  shufflePlaylist() {
    const playlist = this.state.playlist.original.slice().sort(() => (Math.random() > .5) ? 1 : -1);
    // console.log(playlist);
    this.setState({
      playlist: {
        name: this.state.playlist.name,
        current: playlist,
        original: this.state.playlist.original
      },
    }, () => this.changeSong(0));
  }
  unshufflePlaylist() {
    const playlist = this.state.playlist.original.slice();
    // console.log(playlist);
    this.setState({
      playlist: {
        name: this.state.playlist.name,
        current: playlist,
        original: this.state.playlist.original
      },
    }, () => this.changeSong(0)); 
  }

  setShuffle(shuffle) {
    this.setState({shuffle: shuffle});
    if (!shuffle) {
      this.unshufflePlaylist();
    }
    else {
      this.shufflePlaylist();
    }
  }

  playClickHandler() {
    if (this.state.isPlaying) {
        this.playerRef.pause();
    } else {
        this.playerRef.play();
    }
    this.setState({isPlaying: !this.state.isPlaying});
  }
  
  showLoginWindow(type) {
    if (type === 'login') {
      this.setState({loginWindowShown: 'login'});
    } else {
      this.setState({loginWindowShown: 'register'});
    }
  }

  hideLoginWindow() {
    this.setState({loginWindowShown: null});
  }

  logIn(res) {
    if (res.id) {
      this.setState({user: res, loggedIn: true}, () => this.getUserInfo());
      localStorage.user = JSON.stringify(res);
      console.log('User' + res.login + 'loggen in');
    }
  }
  logOut() {
    this.setState({user: null, userInfo: null, loggedIn: false});
    console.log('Log out');
    localStorage.user = '';
  }

  setPlaylist(songlist, name, number) {
    // const playlist = songlist.map((song, index) => {
    //   song.number = index;
    //   return song;
    // })
    // console.log('Playlist to set');
    // console.log(songlist);
    // console.log(songlist);
    if (songlist.length < 1) console.log('Empty playlist to set');
    this.setState({
      playlist: {
        name: name,
        current: songlist,
        original: songlist
      },
      currentSong: songlist[number],
      currentIndex: number
    }, () => {
      console.log('Playlist set to ' + name);
      // console.log(songlist);
      if (this.state.shuffle) this.setShuffle(true);
      else this.setShuffle(false);
      // this.changeSong(number);
    })
  }

  render() {
    // const currentNumber = this.state.currentSong ? this.state.currentSong.number : 0;
    return (
      <Router>
        <div className="app">
          {
            this.state.loginWindowShown ? 
            <SignWindow 
              windowType={this.state.loginWindowShown} 
              logIn={(res) => this.logIn(res)} 
              hideLoginWindow={() => this.hideLoginWindow()} 
              className='app__login'/>
            : null
          }
          <audio ref={ref => {this.playerRef = ref}} type='audio/ogg' />
          <Header
            logOut={() => this.logOut()}
            showLoginWindow={(type) => this.showLoginWindow(type)}
            className="app__header"
            user={this.state.user}
            loggedIn={this.state.loggedIn}
            />
          <Player 
            isPlaying={this.state.isPlaying}
            setPlaying={(isPlaying) => this.setState({isPlaying: isPlaying})}
            setCurrentTime={(timeInPercent) => this.setCurrentTime(timeInPercent)}
            setRepeat={(repeat) => {this.setState({repeat: repeat})}}
            setShuffle={(shuffle) => {this.setShuffle(shuffle)}}
            currentSong={this.state.currentSong}
            currentTime={this.state.currentTime}
            fullTime={this.state.fullTime}
            className="app__player"
            nextSong={() => this.nextSong()}
            prevSong={() => this.prevSong()}
            playClickHandler={() => this.playClickHandler()}
            playerRef={this.playerRef}
          />
          <Routes>
            <Route path="/admin" element={
              (this.state.userInfo && this.state.loggedIn)
              ? <Admin 
                  token={this.state.user.accessToken}
                  className={"app_admin"}
                  verifyUser={() => this.verifyUser()}
                  playlist={this.state.playlist ? this.state.playlist.current : []}
                />
              : 'Sign in as admin to use this page'
            } />
            <Route path="/playlists" element={
              <Playlists
                changePlaylist={id => this.getPlaylist(id)}
                currentPlaylist={this.state.playlist ? this.state.playlist.name : ''}
                isPlaying={this.state.isPlaying}
                play={() => this.playClickHandler()}
              />
            } />
            <Route path="/liked" element={
              <Liked 
                className="app__liked"
                playlist={this.state.playlist ? this.state.playlist.current : []}
                isActive={this.state.playlist ? this.state.playlist.name === 'liked' : false}
                currentId={this.state.currentSong ? this.state.currentSong._id : ''}
                isPlaying={this.state.isPlaying}
                chooseSong={(number) => this.changeSong(number)} 
                play={() => this.playClickHandler()}
                liked={this.state.userInfo ? this.state.userInfo.liked : []}
                likeSong={(id) => this.likeSong(id)}
                setPlaylist={(songlist, name, number) => this.setPlaylist(songlist, name, number)}c
              />} 
            />
            <Route path="/" element={
              <Current 
                className="app__current" 
                playlist={this.state.playlist ? this.state.playlist.current : []}
                currentSongNumber={this.state.currentIndex} 
                isPlaying={this.state.isPlaying}
                chooseSong={(number) => this.changeSong(number)} 
                play={() => this.playClickHandler()}
                liked={this.state.userInfo ? this.state.userInfo.liked : []}
                likeSong={(id) => this.likeSong(id)}
                // setPlaylist={(songlist, name) => this.setPlaylist(songlist, name)}c
              />}/>
          </Routes>
        </div>
      </Router>
    );
  }
}