import React, { Component } from 'react'
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes'
import { SignUpLink } from '../SignUp';

const SignIn = () => {
    return (
        <div>
            <h1>Sign In</h1>
            <SignInForm />
            <SignUpLink/>
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
        
        const {email,password} = this.state;
        this.props
        .firebase
        .doSignInWithEmailAndPassword(email, password)
        .then(auth =>{
            console.log('auth:OK')
            //this.setState(INITIAL_STATE)
            this.props.history.push(ROUTES.HOME)
        })
        .catch(error=>{
            console.log(error)
            this.setState({error})
        })
        event.preventDefault();
    }
    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }


    render() {

        const { email, password, error} = this.state;
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
                {error && <p>{error.message}</p> }
            </form>
        )
    }
}


export default SignIn
const SignInForm = compose(
    withRouter,
    withFirebase)
    (SignInFormBase)
export { SignInForm }