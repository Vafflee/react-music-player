import React from 'react';
import config from '../config/config';

export default class Playlists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: null
        }
    }

    componentDidMount() {
        this.getPlaylists();
    }

    getPlaylists() {
        fetch(config.url + '/api/playlists')
        .then(response => response.json())
        .then(json => {
            let promises = [];
            json.playlists.forEach(pl => {
                promises.push(
                    fetch(`${config.url}/api/playlists/${pl._id}`)
                    .then(res => res.json())
                    // .then(json => json.)
                );
            });
            Promise.all(promises)
            .then(playlists => {
                this.setState({playlists: json.playlists})
                console.log('Playlists updated');
            })
        })
        .catch(err => console.log(err));
    }
    
    render() {
        
        let playlists = null;
        if (this.state.playlists) {
            // console.log(this.state.playlists[0].songs[0]);
            playlists = this.state.playlists.map(pl => 
                <div key={pl._id} onClick={() => this.props.changePlaylist(pl._id)} className={"playlists__playlist playlist " + (this.props.currentPlaylist === pl.name ? "playlist_active" : '')}>
                    <div className="playlist__image">
                        <img src={`${config.url}/songcover/${pl.songs[0]}`} alt="" />
                    </div>
                    <div className="playlist__info">
                        <div className="playlist__name">{pl.name}</div>
                        <div onClick={() => this.props.play()} className={"playlist__play icon-" + (this.props.isPlaying ? "Pause" : "Play")}></div>
                    </div>
                </div>
            );
        }
        
        return <div className="app__playlists playlists">
            {playlists}
        </div>
    }
}