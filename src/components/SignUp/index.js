import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { withFirebase } from '../Firebase'
import { compose } from 'recompose'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'
/**
 * refactor: can you useReducer instead to do more readable
 * in another example we need to use create user and sign in together, but it isnot necessary
 */
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
    isAdmin: false,
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

        const { username, email, passwordOne, isAdmin } = this.state;
        const roles = {}

        if (isAdmin){
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }
        
        this.props
            .firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then((auth) => {
                this.props.firebase.db
                    .collection('Users')
                    .doc(auth.user.uid)
                    .set({
                        id: auth.user.uid,
                        email: email,
                        nombre: username,
                        apellido: '',
                        telefono: '',
                        foto: '',
                        roles:roles
                    }, {
                        merge: true
                    })
                    .then(() => {
                        // BY DEFAULT sign in is done.
                        this.setState(INITIAL_STATE)
                        this.props.history.push(ROUTES.HOME)
                    })
                    .catch(error => {
                        this.setState({ error })
                    })
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
    onChangeCheckBox  = ({target}) =>{
        this.setState({[target.name]:target.checked})
    }
    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            isAdmin,
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
                    placeholder='Confirm ..Password'
                ></input>
                <label><br/>
                    Is Admin? 
                    <input
                    name='isAdmin'
                    value={isAdmin}
                    onChange={this.onChangeCheckBox}
                    type='checkbox'
                    />
                </label><br/>

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
