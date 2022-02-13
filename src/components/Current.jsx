import React from 'react';
import Song from './Song.jsx';

const Current = function(props) {

    const songs = props.playlist
    ? props.playlist.map(
        (song, index) => {
            // console.log(props.playlist);
            return <Song 
                key={index}
                number={index}
                isActive={props.currentSongNumber === index} 
                currentSong={props.currentSongNumber}
                isPlaying={props.isPlaying} 
                song={song}
                // title={song.title} 
                // artist={song.artist} 
                // cover={song.cover}
                clickHandler={props.currentSongNumber !== index ? () => props.chooseSong(index) : () => {return}}
                // clickHandler={(index) => props.chooseSong(index)}
                play={() => props.play()}
                isLiked={props.liked.includes(song._id)}
                // liked={props.liked}
                likeSong={() => props.likeSong(song._id)}
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