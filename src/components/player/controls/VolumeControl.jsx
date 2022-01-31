import React from 'react';

export default function(props) {

    let [volumeState, setVolumeState] = React.useState(0.5);
    let barRef;
    
    const setVolume = (volume) => {
        if (props.playerRef) {
            props.playerRef.volume = volume;
        }
        barRef.value = volume;
        setVolumeState(volume);
    }

    const changeHandler = () => {
        if (props.playerRef) {
            props.playerRef.volume = barRef.value;
        }
        setVolumeState(barRef.value);
    }

    let icon = 'icon-volume-low';
    if (volumeState < 0.001) {icon = 'icon-volume-mute'}
    else if (volumeState > .5) {icon = 'icon-volume-high'}

    return(
        <div className={props.className +" volume"}>
            <div className="volume__icon" onClick={() => setVolume(0)}>
                <i className={icon}></i>
            </div>
            <div className="volume__container">
                <input 
                    onChange={() => changeHandler()} 
                    min='0' max='1' step='0.001' type="range" 
                    className='volume__bar' 
                    ref={(ref) => barRef = ref}/>
                <div className="volume__level" style={{width: volumeState*100 + '%'}} ></div>
            </div>
            {/* <div className="volume__bar" ref={(ref) => {barRef = ref}}>
                <div className="volume__level" ref={(ref) => {levelBarRef = ref}} style={{width: volumeState*100 + '%'}} ></div>
            </div> */}
        </div>
    );
}