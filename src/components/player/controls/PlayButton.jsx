import React from 'react';

export default function PlayButton(props) {    
    return (
        <button 
            onClick={() => {
                props.playClickHandler();
            }}
            className="player__play btn" >
            <i
                className={props.isPlaying ? 'icon-Pause' : 'icon-Play'}
                // src={props.isPlaying ? PauseIcon : PlayIcon}
                alt="play/pause"
                style={props.isPlaying ? {} : {marginRight: '-6px'}}
                />                
        </button>
    );
}