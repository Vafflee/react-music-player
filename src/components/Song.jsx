import config from '../config/config.js';
import placeholder from '../img/cover.jpg';

export default function(props) {
    return(
        <>
            <div className={'current__song song ' + (props.isActive ? 'song__active' : '')} onClick={() => props.clickHandler()} >
                <div 
                    className={"song__img " + (props.isActive ? (props.isPlaying ? 'icon-Pause' : 'icon-Play') : '')}
                    onClick={props.isActive ? () => props.play() : null}>
                    <img src={props.cover ? config.url + '/songcover/' + props.cover : placeholder} alt={props.cover} />
                </div>
                <div className="song__title">{props.title}</div>
                <div className="song__artist">{props.artist}</div>
                <button 
                    className={`btn song__like ${props.isLiked ? 'song__like_active' : ''} icon-Like`}
                    onClick={(e) => {e.stopPropagation(); props.likeSong(props.id)}}
                />
            </div>
            <div className="song__line"></div>
        </>
    );
}