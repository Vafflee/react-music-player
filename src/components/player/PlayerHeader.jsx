export default function PlayerHeader(props) {
    return(
        <div className="player__header">
            <div className="player__title">{props.title}</div>
            <div className="player__author">{props.author}</div>
        </div>
    );
}