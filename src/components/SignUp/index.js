import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ROUTES from '../../constants/routes'


const SignUp = () => {
    return (
        <div>
            <h1>
                Sign Up
        </h1>
            <SignUpForm />
        </div>
    )
}


const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null
}

class SignUpForm extends Component {

    constructor(props) {
        super(props);
        console.log('SignUpForm')
        this.state = { ...INITIAL_STATE }
    }

    onSubmit = (event) => {

    }

    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    render() {
        const { username, email, passwordOne, passwordTwo, error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name='username'
                    value={username}
                    onChange={this.onChange}
                    type='text'
                    placeholder='Nombre Completo'
                ></input>
                <input
                    name='email'
                    value={email}
                    onChange={this.onChange}
                    type='text'
                    placeholder='Email'
                ></input>
                <input
                    name='passwordOne'
                    value={passwordOne}
                    onChange={this.onChange}
                    type='password'
                    placeholder='Password'
                ></input>
                <input
                    name='passwordTwo'
                    value={passwordTwo}
                    onChange={this.onChange}
                    type='password'
                    placeholder='Confirm Password'
                ></input>

                <button type='submit'>Sign Up</button>
                {error && <p>{error.message} </p>}
            </form>
        )
    }
}


const SignUpLink = () => (
    <p>
        ¿No tienes una Cuenta?
        <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
)


export default SignUp
export { SignUpForm, SignUpLink }
