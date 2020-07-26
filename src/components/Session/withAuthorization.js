import React from 'react'
import * as ROUTES from '../../constants/routes'
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import AuthUserContext from './context';

/***
 *  refactor --->   component is displayed even, because the condition is activated in Component did mount   
 *  but if i consume the authUser in render method i avoid this problem
 */

const withAuthorization = condition => Component => {

    class WithAuthorization extends React.Component {

        componentDidMount() {
            console.log('withAuth: ')
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN)
                    }
                }
            )
        }
        componentWillUnmount() {
            this.listener()
        }
        render() {
            return (
                <AuthUserContext.Consumer> 
                    {authUser =>
                        condition(authUser) ? <Component {...this.props} /> : null
                    }
                </AuthUserContext.Consumer>
            )
        }

    }
    return compose(
        withRouter,
        withFirebase
    )(WithAuthorization);
};

export default withAuthorization
