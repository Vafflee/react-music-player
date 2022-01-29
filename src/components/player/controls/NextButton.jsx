import NextIcon from '../../../img/Next-icon.svg'

export default function PrevButton(props) {    
    return (
        <button onClick={() => props.handleClick()} className="player__next btn">
            <i className='icon-Next' alt="next" />
        </button>
    );
}