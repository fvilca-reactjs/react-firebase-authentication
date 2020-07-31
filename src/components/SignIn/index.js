import React, { Component } from 'react'
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes'
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';


/**
 * No se puede realizar una actualización de estado Reaccionar en un componente desmontado. Esto es un no-op, pero indica una pérdida de memoria en su aplicación. Para solucionarlo, cancele todas las suscripciones y tareas asincrónicas en el método componentWillUnmount.
     en SignInFacebookBase (en Firebase / index.js: 10)
     en Desconocido (creado por Context.Consumer)
     con withRouter () (en SignIn / index.js: 15)
     en div (en SignIn / index.js: 11)
     en SignIn (creado por Context.Consumer)
     
 */
const SignIn = () => {
    return (
        <div>
            <h1>Sign In</h1>
            <SignInForm />
            <SignInGoogle />
            <SignInFacebook />
            <SignUpLink />
            <PasswordForgetLink />
        </div>
    )
}

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
}
class SignInFormBase extends Component {

    state = INITIAL_STATE;

    onSubmit = (event) => {

        const { email, password } = this.state;
        this.props
            .firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE })
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                this.setState({ error })
            })
        event.preventDefault();
    }
    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }


    render() {

        const { email, password, error } = this.state;
        const isInvalid = email === '' || password === ''
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name='email'
                    type='text'
                    value={email}
                    placeholder='email'
                    onChange={this.onChange}
                />
                <input
                    name='password'
                    type='password'
                    value={password}
                    placeholder='password'
                    onChange={this.onChange}
                />
                <button disabled={isInvalid} >Sign In</button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}


class SignInGoogleBase extends Component {

    state = { error: null }

    onSubmit = (event) => {
        this.props.firebase.doSignInWithGoogle()
            .then(socialAuthUser => {
                this.props.firebase.db
                    .collection('Users')
                    .doc(socialAuthUser.user.uid)
                    .set({
                        id: socialAuthUser.user.uid,
                        email: socialAuthUser.user.email,
                        nombre: socialAuthUser.user.displayName,
                        apellido: '',
                        telefono: '',
                        foto: '',
                        roles: [],
                    })
                    .then(() => {
                        // BY DEFAULT sign in is done.
                        this.setState({ error: null })
                        this.props.history.push(ROUTES.HOME)
                    })
                    .catch(error => {
                        this.setState({ error })
                    })
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                this.setState({ error })
            })
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <button>Sign In with Google</button>
                {this.error && <p>{this.error.message} </p>}
            </form>
        )
    }
}
class SignInFacebookBase extends Component {

    state = { error: null }

    onSubmit = (event) => {
        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                this.props.firebase.db
                    .collection('Users')
                    .doc(socialAuthUser.user.uid)
                    .set({
                        id: socialAuthUser.user.uid,
                        email: socialAuthUser.additionalUserInfo.profile.email,
                        nombre: socialAuthUser.additionalUserInfo.profile.name,
                        apellido: '',
                        telefono: '',
                        foto: '',
                        roles: [],
                    })
                    .then(() => {
                        this.setState({ error: null })
                        this.props.history.push(ROUTES.HOME)
                    })
                    .catch(error => {
                        this.setState({ error })
                    })
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                this.setState({ error })
            })

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <button>Sign In with Facebook</button>
                {this.error && <p>{this.error.message} </p>}
            </form>
        )
    }
}



export default SignIn

const SignInForm = compose(
    withRouter,
    withFirebase)
    (SignInFormBase)

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase)

const SignInFacebook = compose(
    withRouter,
    withFirebase,
)(SignInFacebookBase)

export { SignInForm, SignInGoogle, SignInFacebook }