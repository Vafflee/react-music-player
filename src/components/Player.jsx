import React from 'react';

import PlayerHeader from './player/PlayerHeader';
import PlayerImages from './player/PlayerImages';
import PlayerControls from './player/PlayerControls';

export default class Player extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isPlaying: false,
            currentTime: 0,
            fullTime: 0
        }
        
    }

    componentDidMount() {
        this.setState({fullTime: this.playerRef ? this.playerRef.duration : 0})
        this.interval = setInterval(() => {
            this.setState({
                currentTime: this.playerRef ? this.playerRef.currentTime : 0,
                fullTime: this.playerRef ? this.playerRef.duration : 0
            });
        }, 200);
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
        const title = this.props.currentSong.title;
        const author = this.props.currentSong.author;
        return (
            <div className={'player ' + this.props.className}>
                <audio ref={ref => {this.playerRef = ref}}>
                    <source src={this.props.currentSong.url} type='audio/ogg' />
                    Your browser does not support the audio element
                </audio>
                <PlayerHeader title={title} author={author} />
                <PlayerImages />
                <PlayerControls
                    playClickHandler={() => this.playClickHandler()}
                    isPlaying={this.state.isPlaying}
                    currentTime={this.state.currentTime}
                    fullTime={this.state.fullTime}
                />
                {/* <PlayButton isPlaying={this.state.isPlaying} playClickHandler={() => this.playClickHandler()} /> */}
            </div>
        )
    };
}