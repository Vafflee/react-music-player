import React from 'react';

const formatTime = function(time) {
    let minutes =  Math.floor(time / 60).toString();
    let seconds =  Math.floor(time % 60).toString();
    if (seconds.length < 2) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}

export default function Timeline(props) {

    let [state, setState] = React.useState({mousepos: 0});
    const timelineRef = React.useRef();

    const mouseleaveHandler = () => {setState({mousepos: 0})};
    const mousemoveHandler = (e) => {
        setState({mousepos: e.offsetX / document.querySelector('.player__bar-container').offsetWidth * 100});
    };

    React.useEffect(() => {
        timelineRef.current.addEventListener('mouseleave', mouseleaveHandler);
        timelineRef.current.addEventListener('mousemove', mousemoveHandler);
        return () => {
            timelineRef.current.removeEventListener('mouseleave', mouseleaveHandler)
            timelineRef.current.removeEventListener('mousemove', mousemoveHandler)
        };
    })

    const length = props.fullTime ? props.currentTime / props.fullTime * 100 : 0;

    return (
        <div className="player__timeline">
            <div className="player__time">{formatTime(props.currentTime)}</div>
            <div className="player__bar-container" ref={timelineRef} onClick={() => {props.setCurrentTime(state.mousepos)}}>
                <div className="player__bar" style={{width: `${length}%`}}></div>
                <div className="player__playhead" style={{width: `${state.mousepos}%`}}></div>
            </div>
            <div className="player__time">{formatTime(props.fullTime)}</div>
        </div>
    );
}