import PrevIcon from '../../../img/Prev-icon.svg'

export default function NextButton(props) {    
    return (
        <button onClick={() => props.handleClick()} className="player__prev btn">
            <i className='icon-Prev' alt="previous" />
        </button>
    );
}