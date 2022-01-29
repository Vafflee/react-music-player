export default function PlayerHeader(props) {
    return(
        <div className="player__header">
            <div className="player__title">{props.title}</div>
            <div className="player__artist">{props.artist}</div>
        </div>
    );
}