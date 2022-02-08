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
        if (!details.login || !details.password) {
            alert('Please fill all inputs');
            return;
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
        .then(response => {
            if (response.status === 500) return {message: 'Server error'};
            if (response.status === 404) return {message: 'Not found'};
            if (response.status === 400) return {message: 'Roles parce error'};
            return response.json()
        })
        .then(json => {
            console.log(json);
            if (json.message === 'Server error') return alert('Server error');
            if (json.message === 'Not found') return alert('User not found');
            if (json.message === 'Roles parce error') return alert('Roles parce error');
            if (json.message === 'User registered succesfully') {
                props.hideLoginWindow();
                return;
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div className={props.className + " register"} onClick={() => props.hideLoginWindow()}>
            <form onSubmit={(e) => handleSubmit(e)} onClick={(e) => e.stopPropagation()} className='login__form' action={config.url + '/api/auth/signin'} method="post">
                <h3 className='login__header'>Register</h3>
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