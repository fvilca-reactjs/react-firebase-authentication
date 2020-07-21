import React, { Component } from 'react'
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null
}

class PasswordChangeForm extends Component {

    state = INITIAL_STATE;

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value })
    }

    onSubmit = (evt) => {

        this.props.firebase
            .doPasswordUpdate(this.state.passwordOne)
            .then(() => {
                this.setState(INITIAL_STATE)
            })
            .catch((error) => {
                this.setState({ error })
            });

        evt.preventDefault();
    }

    render() {
        const { passwordOne, passwordTwo, error } = this.state
        const isInvalid = passwordOne !== passwordTwo || passwordOne === ''
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name='passwordOne'
                    value={passwordOne}
                    onChange={this.onChange}
                    placeholder='new Password'
                    type='password'
                />
                <input
                    type='password'
                    name='passwordTwo'
                    value={passwordTwo}
                    onChange={this.onChange}
                    placeholder='Confirm new Password'

                />
                <button disabled={isInvalid} >Reset my Password</button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

export default withFirebase(PasswordChangeForm);
