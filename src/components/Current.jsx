import React from 'react';

const Song = function(props) {
    return(
        <div>
            <b>{props.title}</b>
            - {props.author}
            [{props.duration}]
        </div>
    );
}

const Current = function(props) {
    
    const songs = props.filesList
    ? props.filesList.map(
        (song, index) => <Song key={index} title={song.title} author={song.author} duration={song.duration} />
        ) 
        : null;
        
    return(
        <>{
            songs ?
                <div>
                    {songs}
                </div>
            : "There is no songs yet"
        }</>
    );
}

export default Current;