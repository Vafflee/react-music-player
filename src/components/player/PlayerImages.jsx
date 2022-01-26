import image from '../../img/test.jpg';

export default function PlayerImages(props) {
    return(
        <div className="player__images">
            <div className="player__border-outer">
                <div className="player__border-inner">
                    <img src={image} alt="test" />
                </div>
            </div>
        </div>
    );
}