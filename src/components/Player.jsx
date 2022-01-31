import React from 'react';

import PlayerHeader from './player/PlayerHeader';
import PlayerImages from './player/PlayerImages';
import PlayerControls from './player/PlayerControls';

export default class Player extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let title, artist, cover = '';
        let number = 0;
        if (this.props.currentSong) {
            title = this.props.currentSong.title;
            artist = this.props.currentSong.artist;
            cover = this.props.currentSong.cover;
            number = this.props.currentSong.number;
        }
        return (
            <div className={'player ' + this.props.className}>
                <PlayerHeader title={title} artist={artist} />
                <PlayerImages image={cover} />
                <PlayerControls
                    playClickHandler={() => this.props.playClickHandler()}
                    isPlaying={this.props.isPlaying}
                    currentTime={this.props.currentTime}
                    fullTime={this.props.fullTime}
                    setCurrentTime={(timeInPercent) => this.props.setCurrentTime(timeInPercent)}
                    setRepeat={(repeat) => {this.props.setRepeat(repeat)}}
                    setShuffle={(shuffle) => {this.props.setShuffle(shuffle)}}
                    nextSong={() => {this.props.nextSong()}}
                    prevSong={() => {this.props.prevSong()}}
                    number={number}
                    playerRef={this.props.playerRef}
                />
            </div>
        )
    };
}