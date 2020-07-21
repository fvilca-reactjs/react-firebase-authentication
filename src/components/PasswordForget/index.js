import React, { Component } from 'react'
import { withFirebase } from '../Firebase/'
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes'

/**
 * refactor : can you use a stateless component
 * refactor --> when send an email , I recieve  a mail with this account noreply@yamaya-app.firebaseapp.com
 */

const PasswordForget = () => {
    return (
        <div>
            <h1> PasswordForget </h1>
            <PasswordForgetForm />
        </div>
    )
}

const INITIAL_STATE = {
    email: '',
    error: null
};

class PasswordForgetFormBase extends Component {

    state = INITIAL_STATE //! or {...INITIAL_STATE}

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value })
    }
    onSubmit = (evt) => {
        this.props.firebase
            .doPasswordReset(this.state.email)
            .then(() => {
                this.setState({ ...INITIAL_STATE })
            })
            .catch(error => {
                this.setState({ error })
            })
        evt.preventDefault();
    }

    render() {

        const { email, error } = this.state;
        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name='email'
                    type='text'
                    onChange={this.onChange}
                    value={this.state.email}
                    placeholder='email adress'
                />
                <button disabled={isInvalid}> Reset My Password </button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const PasswordForgetLink = () => {
    return (
        <p> <Link to={ROUTES.PASSWORD_FORGET}> Forgot Password? </Link></p>
    )
}
export default PasswordForget;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase)
export { PasswordForgetLink, PasswordForgetForm };
