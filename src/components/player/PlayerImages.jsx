import image from '../../img/test.jpg';
import config from '../../config/config.js';

export default function PlayerImages(props) {
    return(
        <div className="player__images">
            <div className="player__border-outer">
                <div className="player__border-inner">
                    <img src={`${config.url}/songcover/${props.image}` ?? image} alt="test" />
                </div>
            </div>
        </div>
    );
}