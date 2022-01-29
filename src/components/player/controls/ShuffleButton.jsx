export default function ShuffleButton(props) {    
    
    const changeHandler = (checkbox) => {
        props.setShuffle(checkbox.checked);
    }

    return (
        <input type="checkbox" className="player__shuffle checkbox icon-Shuffle" onChange={(e) => changeHandler(e.target)} />
    );
}