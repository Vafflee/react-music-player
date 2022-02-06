import React from 'react';
import Song from './Song.jsx';

const Liked = function(props) {

    let songs = [];
    if (props.playlist) {
        
        songs = props.playlist
        .filter(song => {
            return props.liked.includes(song._id)})
        .map((song, index) => {
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
            />
            })

    }

    return(
        <>{
            (songs && songs.length > 0) ?
                <div className={`${props.className} current`}>
                    {songs}
                </div>
            : "There is no songs yet, like some tracks to see it here"
        }</>
    );
}

export default Liked;