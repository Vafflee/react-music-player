import config from '../config/config';

const RegisterWindow = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        // const login = document.querySelector('.login__loginput').value;
        // const password = document.querySelector('.login__passinput').value;
        const details = {
            login: document.querySelector('.login__loginput').value,
            password: document.querySelector('.login__passinput').value,
            roles: '["user"]'
        }
        let formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
    
        fetch(config.url + '/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                // 'Content-Type': 'application/form'
            },
            body: formBody
        })
        .then(response => response.json())
        .then(json => {console.log(json); props.hideLoginWindow()})
        .catch(err => console.log(err));
    }

    return (
        <div className={props.className + " register"} onClick={() => props.hideLoginWindow()}>
            <form onSubmit={(e) => handleSubmit(e)} onClick={(e) => e.stopPropagation()} className='login__form' action={config.url + '/api/auth/signin'} method="post">
                <label className='login__label' htmlFor="login">Login</label>
                <input className='login__loginput' type="login" name="login" />
                <label className='login__label' htmlFor="password">Password</label>
                <input className='login__passinput' type="password" name="password" />
                <button className='login__submit' type='submit'>Sign up</button>
            </form>
        </div>
    );
}

export default RegisterWindow;