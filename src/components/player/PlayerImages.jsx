import placeholder from '../../img/cover.jpg';
import config from '../../config/config.js';

export default function PlayerImages(props) {
    return(
        <div className="player__images">
            <div className="player__border-outer">
                <div className="player__border-inner">
                    <img src={props.hasImage ? `${config.url}/songcover/${props.id}` : placeholder} alt="test" />
                </div>
            </div>
        </div>
    );
}