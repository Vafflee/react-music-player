import config from '../config/config';

const LoginWindow = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const details = {
            login: document.querySelector('.login__loginput').value,
            password: document.querySelector('.login__passinput').value
        }
        let formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch(config.url + '/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
        .then(response => response.json())
        .then(json => {props.logIn(json); props.hideLoginWindow()})
        .catch(err => console.log(err));
    }

    return (
        <div className={props.className + " login"} onClick={() => props.hideLoginWindow()}>
            <form onSubmit={(e) => handleSubmit(e)} onClick={(e) => e.stopPropagation()} className='login__form' action={config.url + '/api/auth/signin'} method="post">
                <label className='login__label' htmlFor="login">Login</label>
                <input className='login__loginput' type="login" name="login" />
                <label className='login__label' htmlFor="password">Password</label>
                <input className='login__passinput' type="password" name="password" />
                <button className='login__submit' type='submit'>Sign in</button>
            </form>
        </div>
    );
}

export default LoginWindow;