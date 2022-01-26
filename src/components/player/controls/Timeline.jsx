const formatTime = function(time) {
    let minutes =  Math.floor(time / 60).toString();
    let seconds =  Math.floor(time % 60).toString();
    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}

export default function Timeline(props) {    
    
    return (
        <div className="player__timeline">
            <div className="player__time">{formatTime(props.currentTime)}</div>
            <div className="player__bar-container">
                <div className="player__bar" style={{width: `${props.currentTime / props.fullTime * 100}%`}}></div>
            </div>
            <div className="player__time">{formatTime(props.fullTime)}</div>
        </div>
    );
}