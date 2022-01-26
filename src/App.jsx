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
      filesList: null,
      currentSong: {
          url: 'http://localhost:4000/songfile/test.mp3',
          title: 'Joy to the world',
          author: 'John Bartmann'
      }
    };
  }

  async getFilesList() {
    const response = await fetch('http://localhost:4000/record');
    if(!response.ok) {
      alert(`An error occured: ${response.statusText}`)
      return;
    }
    const filesList = await response.json();
    this.setState({filesList: filesList})
  }

  componentDidMount() {
    this.getFilesList();
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Header className="app__header" />
          <Player currentSong={this.state.currentSong} className="app__player"/>
          <Routes>
            <Route path="/playlists" element={"<Playlists />"} />
            <Route path="/liked" element={'<Liked />'} />
            <Route path="/" element={<Current filesList={this.state.filesList}/>}/>
          </Routes>
        </div>
      </Router>
    );
  }
}