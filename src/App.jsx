import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Admin from './components/Admin.jsx';
import Player from './components/Player.jsx';
import Header from './components/Header.jsx';
import SignWindow from './components/SignWindow.jsx';
import Current from './components/Current.jsx';
import config from './config/config.js';


export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loginWindowShown: null,
      user: localStorage.user ? JSON.parse(localStorage.user) : null,
      playlist: null,
      originalPlaylist: null,
      currentSong: null,
      currentIndex: 0,
      isPlaying: false,
      shuffle: false,
      repeat: false,
      currentTime: 0,
      fullTime: 0
    };
    this.playerRef = null;
  }

  async getFilesList() {
    const response = await fetch(config.url + '/record');
    if(!response.ok) {
      alert(`An error occured: ${response.statusText}`)
      return;
    }
    let playlist = await response.json();
    playlist = playlist.map((song, i) => {
      song.number = i;
      return song;
    });
    this.playerRef.src = `${config.url}/songfile/${playlist[0].file}`;
    this.setState({originalPlaylist: playlist, playlist: playlist, currentSong: playlist[0]})
  }

  componentDidMount() {
    this.getFilesList();
    this.playerRef.addEventListener('timeupdate', () => this.timeUpdate());
    this.playerRef.addEventListener('durationchange', () => this.updateInfo());
    this.playerRef.addEventListener('ended', () => this.nextSong());
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

  changeSong(index) {
    this.playerRef.src = `${config.url}/songfile/${this.state.playlist[index].file}`;
    this.playerRef.load();
    this.setState({currentSong: this.state.playlist[index], currentIndex: index});
    
    if (this.state.isPlaying) {
      this.playerRef.play();
    }
  }

  nextSong() {
    const number = this.state.currentIndex + 1;
    if (number < this.state.playlist.length) { 
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
      this.changeSong(this.state.playlist.length - 1);
    }
  }

  shufflePlaylist() {
    const playlist = this.state.originalPlaylist.slice().sort(() => (Math.random() > .5) ? 1 : -1);
    console.log(playlist);
    this.setState({
      playlist: playlist,
    }, () => this.changeSong(0));
  }
  unshufflePlaylist() {
    const playlist = this.state.originalPlaylist.slice()
    console.log(playlist);
    this.setState({
      playlist: playlist,
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
    if (res.login) {
      this.setState({user: res});
      localStorage.user = JSON.stringify(res);
    }
  }
  logOut() {
    this.setState({user: null});
    localStorage.user = '';
  }

  render() {
    
    const src = this.state.currentSong ? this.state.currentSong.file : '';
    const currentNumber = this.state.currentSong ? this.state.currentSong.number : 0;
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
          <Header logOut={() => this.logOut()} showLoginWindow={(type) => this.showLoginWindow(type)} className="app__header" user={this.state.user}/>
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
            <Route path="/admin" element={<Admin className={"app_admin"} />} />
            <Route path="/playlists" element={"<Playlists />"} />
            <Route path="/liked" element={'<Liked />'} />
            <Route path="/" element={
              <Current 
                className="app__current" 
                playlist={this.state.playlist}
                currentSongNumber={currentNumber} 
                isPlaying={this.state.isPlaying}
                chooseSong={(number) => this.changeSong(number)} 
                play={() => this.playClickHandler()}
                />}/>
          </Routes>
        </div>
      </Router>
    );
  }
}