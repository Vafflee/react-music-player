import React from 'react';

import PlayerHeader from './player/PlayerHeader';
import PlayerImages from './player/PlayerImages';
import PlayerControls from './player/PlayerControls';

export default class Player extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            shuffle: false,
            repeat: false,
            currentTime: 0,
            fullTime: 0
        }

        this.playerRef = null;
    }

    updateInfo() {
        this.setState({
            currentTime: this.playerRef.currentTime,
            fullTime: this.playerRef.duration
        });
    }

    componentDidMount() {
        this.playerRef.addEventListener('timeupdate', () => this.timeUpdate());
        this.playerRef.addEventListener('durationchange', () => this.updateInfo());
    }

    timeUpdate() {
        this.setState({
            currentTime: this.playerRef.currentTime,
            fullTime: this.playerRef.duration
        });
    }
    setCurrentTime(timeInPercent) {
        this.playerRef.currentTime = this.state.fullTime * timeInPercent / 100;
    }

    playClickHandler() {
        if (this.props.isPlaying) {
            this.playerRef.pause();
        } else {
            this.playerRef.play();
        }
        this.props.setPlaying(!this.props.isPlaying);
    }

    pause() {
        if (this.props.isPlaying) {
            this.playerRef.pause();
        }
        this.setState({isPlaying: false});
    }

    render() {
        let title, artist, src, cover = '';
        let number = 0;
        if (this.props.currentSong) {
            title = this.props.currentSong.title;
            artist = this.props.currentSong.artist;
            src = this.props.currentSong.file;
            cover = this.props.currentSong.cover;
            number = this.props.currentSong.number;
        }
        return (
            <div className={'player ' + this.props.className}>
                <audio 
                    ref={ref => {this.playerRef = ref}}
                    src={`http://localhost:4000/songfile/${src}`}
                    type='audio/ogg'
                    preload='metadata'
                />
                <PlayerHeader title={title} artist={artist} />
                <PlayerImages image={cover} />
                <PlayerControls
                    playClickHandler={() => this.playClickHandler()}
                    isPlaying={this.props.isPlaying}
                    currentTime={this.state.currentTime}
                    fullTime={this.state.fullTime}
                    setCurrentTime={(timeInPercent) => this.setCurrentTime(timeInPercent)}
                    setRepeat={(repeat) => {this.setState({repeat: repeat})}}
                    setShuffle={(shuffle) => {this.setState({shuffle: shuffle})}}
                    nextSong={() => {this.pause(); this.props.nextSong()}}
                    prevSong={() => {this.pause(); this.props.prevSong()}}
                    number={number}
                />
            </div>
        )
    };
}