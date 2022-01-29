export default function RepeatButton(props) {

    const changeHandler = (checkbox) => {
        props.setRepeat(checkbox.checked);
    }

    return (
        <input type='checkbox' className="player__repeat checkbox icon-Repeat" onChange={(e) => changeHandler(e.target)}/>
    );
}