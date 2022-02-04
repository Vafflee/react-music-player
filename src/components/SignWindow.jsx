import LoginWindow from "./LoginWindow";
import RegisterWindow from "./RegisterWindow";

export default (props) => {
    return (
        (props.windowType === 'login') ? <LoginWindow logIn={(res) => props.logIn(res)} className={props.className} hideLoginWindow={props.hideLoginWindow}/>
        : <RegisterWindow className={props.className} hideLoginWindow={props.hideLoginWindow}/>
    
    )}