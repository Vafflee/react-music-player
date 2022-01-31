import PlayButton from './controls/PlayButton';
import PrevButton from './controls/PrevButton';
import NextButton from './controls/NextButton';
import ShuffleButton from './controls/ShuffleButton';
import RepeatButton from './controls/RepeatButton';
import Timeline from './controls/Timeline';
import VolumeControl from './controls/VolumeControl';

export default function PlayerControls(props) {

    return(
        <div className="player__controls">
            <Timeline 
                currentTime={props.currentTime} 
                fullTime={props.fullTime} 
                setCurrentTime={(timeInPercent) => props.setCurrentTime(timeInPercent)}
                />
            <div className="player__buttons">
                <ShuffleButton setShuffle={(shuffle) => {props.setShuffle(shuffle)}} />
                <RepeatButton setRepeat={(repeat) => {props.setRepeat(repeat)}} />
                <PrevButton handleClick={() => props.prevSong()} />
                <PlayButton playClickHandler={() => props.playClickHandler()} isPlaying={props.isPlaying} />
                <NextButton handleClick={() => props.nextSong()} />
                <VolumeControl className='player__volume' playerRef={props.playerRef}/>
            </div>
        </div>
    );
}