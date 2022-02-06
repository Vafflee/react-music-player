import React from 'react';
import Song from './Song.jsx';

const Current = function(props) {

    const songs = props.playlist
    ? props.playlist.map(
        (song, index) => {
            return <Song 
            key={song.number}
            id={song._id}
            isActive={props.currentSongNumber === song.number} 
            isPlaying={props.isPlaying} 
            title={song.title} 
            artist={song.artist} 
            cover={song.cover}
            clickHandler={props.currentSongNumber !== song.number ? () => props.chooseSong(index) : () => {return}}
            play={() => props.play()}
            isLiked={props.liked.includes(song._id)}
            likeSong={(id) => props.likeSong(id)}
            />})
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