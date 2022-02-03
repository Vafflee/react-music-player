import React from 'react';
import config from '../config/config.js';
import placeholder from '../img/cover.jpg';

const Song = function(props) {
    return(
        <>
            <div className={'current_song song ' + (props.isActive ? 'song_active' : '')} onClick={() => props.clickHandler()} >
                <div 
                    className={"song_img " + (props.isActive ? (props.isPlaying ? 'icon-Pause' : 'icon-Play') : '')}
                    onClick={props.isActive ? () => props.play() : null}>
                    <img src={props.cover ? config.url + '/songcover/' + props.cover : placeholder} alt={props.cover} />
                </div>
                <div className="song_title">{props.title}</div>
                <div className="song_artist">{props.artist}</div>
                <input type='checkbox' className="checkbox song_like icon-Like" />
            </div>
            <div className="song_line"></div>
        </>
    );
}

const Current = function(props) {
    
    const songs = props.playlist
    ? props.playlist.map(
        (song, index) => <Song 
            key={song.number}
            isActive={props.currentSongNumber === song.number} 
            isPlaying={props.isPlaying} 
            title={song.title} 
            artist={song.artist} 
            cover={song.cover}
            clickHandler={props.currentSongNumber !== song.number ? () => props.chooseSong(index) : () => {return}}
            play={() => props.play()}
            />)
    : null;
    return(
        <>{
            songs ?
                <div className={`${props.className} current`}>
                    {songs}
                </div>
            : "There is no songs yet"
        }</>
    );
}

export default Current;