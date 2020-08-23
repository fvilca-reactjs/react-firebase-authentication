import React from 'react'
import { withFirebase } from '../Firebase'
import AuthUserContext from './context'
/**
 * this  component was created for encapsulate withfirebase and onAuthStateChanged and Provider
 * also authUser allaws another components to reuse this
 * ? refactor --> maybe instead of high order component provider could be used  in the father component like Index root
 * 
 * 
 */
const withAuthentication = (Component) => {

    class withAuthentication extends React.Component {

        state = {
            authUser: null //authUser: JSON.parse(localStorage.getItem('authUser')),
        }

        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    localStorage.setItem('authUser', JSON.stringify(authUser));
                    this.setState({ authUser });
                },
                () => {
                    localStorage.removeItem('authUser');
                    this.setState({ authUser: null });
                },
            );
        }

        componentWillUnmount() {
            if(typeof this.listener === "function"){
                this.listener();
              }
        }

        render() {
            
            return (
                <AuthUserContext.Provider value={this}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            )
        }
    }

    return withFirebase(withAuthentication)
}


export default withAuthentication;
