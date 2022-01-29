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
      currentSong: null,
      isPlaying: false
    };
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
    this.setState({playlist: playlist, currentSong: playlist[0]})
  }

  componentDidMount() {
    this.getFilesList();
  }

  changeSong(number) {
    this.setState({currentSong: this.state.playlist[number]});
  }

  nextSong() {
    this.changeSong((this.state.currentSong.number + 1 < this.state.playlist.length) ? this.state.currentSong.number + 1 : 0);
  }

  prevSong() {
    this.changeSong((this.state.currentSong.number > 0) ? this.state.currentSong.number - 1 : this.state.playlist.length - 1);
  }
  
  render() {
    return (
      <Router>
        <div className="app">
          <Header className="app__header" />
          <Player 
            isPlaying={this.state.isPlaying}
            setPlaying={(isPlaying) => this.setState({isPlaying: isPlaying})}
            currentSong={this.state.currentSong}
            className="app__player"
            nextSong={() => this.nextSong()}
            prevSong={() => this.prevSong()}
          />
          <Routes>
            <Route path="/playlists" element={"<Playlists />"} />
            <Route path="/liked" element={'<Liked />'} />
            <Route path="/" element={<Current className="app_current" playlist={this.state.playlist}/>}/>
          </Routes>
        </div>
      </Router>
    );
  }
}