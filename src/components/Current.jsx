import React from 'react';

const Song = function(props) {
    return(
        <>
            <div className='current_song song'>
                <img className='song_img' src={`http://localhost:4000/songcover/${props.cover}`} alt={props.cover} />
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
        (song, index) => <Song key={index} title={song.title} artist={song.artist} cover={song.cover}/>
        ) 
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