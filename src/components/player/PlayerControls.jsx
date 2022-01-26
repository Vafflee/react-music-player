import PlayButton from './controls/PlayButton';
import PrevButton from './controls/PrevButton';
import NextButton from './controls/NextButton';
import ShuffleButton from './controls/ShuffleButton';
import RepeatButton from './controls/RepeatButton';
import Timeline from './controls/Timeline';

export default function PlayerControls(props) {
    return(
        <div className="player__controls">
            <Timeline currentTime={props.currentTime} fullTime={props.fullTime}/>
            <div className="player__buttons">
                <ShuffleButton />
                <PrevButton />
                <PlayButton playClickHandler={() => props.playClickHandler()} isPlaying={props.isPlaying} />
                <NextButton />
                <RepeatButton className="player__repeat" />
            </div>
        </div>
    );
}