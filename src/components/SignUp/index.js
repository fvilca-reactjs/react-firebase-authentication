import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import { withFirebase } from '../Firebase'
import {compose} from 'recompose'

const SignUp = () => {
    return (
        <div>
            <h1> Sign Up </h1>
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

class SignUpFormBase extends Component {

    /*constructor(props) {
        super(props);
        console.log('SignUpForm')
        this.state = { ...INITIAL_STATE }
    }*/
    state = { ...INITIAL_STATE }

    onSubmit = (event) => {

        const { email, passwordOne } = this.state;
        this.props
            .firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(() => {
                this.setState(INITIAL_STATE)
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                this.setState({ error })
                console.log('state:', this.state)
            })
        event.preventDefault();
    }

    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error
        } = this.state;

        const isInvalid =
            passwordTwo !== passwordOne ||
            passwordOne === '' ||
            passwordTwo === '' ||
            email === '' || username === '';

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

                <button disabled={isInvalid} type='submit'>Sign Up</button>

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

const SignUpForm = compose(
    withRouter,
    withFirebase)
    (SignUpFormBase);

export { SignUpForm, SignUpLink }
