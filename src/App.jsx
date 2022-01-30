import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Player from './components/Player.jsx';
import Header from './components/Header.jsx';
import Current from './components/Current.jsx';


export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
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
    const response = await fetch('http://localhost:4000/record');
    if(!response.ok) {
      alert(`An error occured: ${response.statusText}`)
      return;
    }
    let playlist = await response.json();
    playlist = playlist.map((song, i) => {
      song.number = i;
      return song;
    });
    this.playerRef.src = `http://localhost:4000/songfile/${playlist[0].file}`;
    this.setState({originalPlaylist: playlist, playlist: playlist, currentSong: playlist[0]})
  }

  componentDidMount() {
    this.getFilesList();
    this.playerRef.addEventListener('timeupdate', () => this.timeUpdate());
    this.playerRef.addEventListener('durationchange', () => this.updateInfo());
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
    this.playerRef.src = `http://localhost:4000/songfile/${this.state.playlist[index].file}`;
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
  
  render() {
    
    const src = this.state.currentSong ? this.state.currentSong.file : '';
    const currentNumber = this.state.currentSong ? this.state.currentSong.number : 0;
    return (
      <Router>
        <div className="app">
          <audio ref={ref => {this.playerRef = ref}} type='audio/ogg' />
          <Header className="app__header" />
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
          />
          <Routes>
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