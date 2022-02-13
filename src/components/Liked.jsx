import React from 'react';
import Song from './Song.jsx';
import config from '../config/config';

const Liked = class Liked extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            liked: props.liked,
            playlist: []
        };
    }

    async getLikedPlaylist(likedArray) {
        if (!likedArray) return;
        const promises = [];
        likedArray.forEach( songId => {
        promises.push(
            fetch(config.url + '/api/songs/' + songId)
            .then(res => res.json())
        );
        });
        Promise.all(promises).then(playlist => {
            this.setState({playlist: playlist});
        });
    }

    componentDidMount() {
        // console.log(this.props.liked == this.state.liked);
        this.getLikedPlaylist(this.props.liked);
    }
    componentDidUpdate() {
        // console.log(this.props.liked == this.state.liked);
        if (this.props.liked != this.state.liked) {
            this.setState({liked: this.props.liked}, () => this.getLikedPlaylist(this.props.liked));
        }
    }
    
    clickHandler (songId, index) {
        // console.log('Clicked: ' + songId);
        if (this.props.isActive) {
            if (songId === this.props.currentId) return;

            let newIndex = 0;
            this.props.playlist.forEach((song, index) => {
                if (song._id === songId) newIndex = index;
            });
            this.props.chooseSong(newIndex);
        } else {
            this.props.setPlaylist(this.state.playlist, 'liked', index);
        }
    }

    render() {
        let songs;
        
        if (!this.props.isActive) {
            songs = this.state.playlist.map( (song, index) => {
                return <Song
                    key={index}
                    number={index}
                    song={song}
                    isActive={false}
                    isPlaying={this.props.isPlaying}
                    play={() => this.props.play()}
                    isLiked={this.state.liked.includes(song._id)}
                    likeSong={() => this.props.likeSong(song._id)}
                    clickHandler={() => {this.clickHandler(song._id, index)}}
                />;
            });
        } else {
            songs = this.state.playlist.map( (song, index) => {
                return <Song
                    key={index}
                    number={index}
                    song={song}
                    isActive={song._id === this.props.currentId}
                    isPlaying={this.props.isPlaying}
                    play={() => this.props.play()}
                    isLiked={this.state.liked.includes(song._id)}
                    likeSong={() => this.props.likeSong(song._id)}
                    clickHandler={() => {this.clickHandler(song._id, index)}}
                />;
            });
        }

        return(
            <>{
            (songs && songs.length > 0) ?
                <div className={`${this.props.className} current`}>
                    {songs}
                </div>
            : "There is no songs yet, like some tracks to see it here"
            }</>
        );
    }
}

export default Liked;