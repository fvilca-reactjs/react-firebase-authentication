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

            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN)
                    }
                },
                () => this.props.history.push(ROUTES.SIGN_IN)
            )
        }
        componentWillUnmount() {
            if(typeof this.listener === "function"){
                this.listener();
              }
        }
        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser)
                            ? <Component {...this.props} />
                            : 'solo admins'
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
