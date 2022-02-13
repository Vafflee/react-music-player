import config from '../config/config.js';
import placeholder from '../img/cover.jpg';
import React from 'react';

export default function(props) {

    return(
        props.song ?
        <>
            <div className={'current__song song ' + (props.isActive ? 'song__active' : '')} onClick={() => props.clickHandler()} >
                <div 
                    className={"song__img " + (props.isActive ? (props.isPlaying ? 'icon-Pause' : 'icon-Play') : '')}
                    onClick={props.isActive ? () => props.play() : null}>
                    <img src={props.song.cover ? config.url + '/songcover/' + props.song._id : placeholder} alt={props.song.cover} />
                </div>
                <div className="song__title">{props.song.title}</div>
                <div className="song__artist">{props.song.artist}</div>
                <button 
                    className={`btn song__like ${props.isLiked ? 'song__like_active' : ''} icon-Like`}
                    onClick={(e) => {e.stopPropagation(); props.likeSong()}}
                />
                
            </div>
            <div className="song__line"></div>
        </> : null
    );
}