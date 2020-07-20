import React from 'react'
import { withFirebase } from '../Firebase'
import AuthUserContext from './context'
/**
 * this  component was created for encapsulate withfirebase and onAuthStateChanged and Provider
 * aldo authUser aloows another components to reuse this
 * ? refactor --> maybe instead of high order component provider could be used  in the father component like Index root
 * 
 * 
 */
const withAuthentication = (Component) => {

    class withAuthentication extends React.Component {

        state = { authUser: null }

        componentDidMount() {
            console.log('did:Mount:')
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (authUser) {
                        this.setState({ authUser })
                    } else {
                        this.setState({ authUser: null });
                    }
                })
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            )
        }
    }

    return withFirebase(withAuthentication)
}


export default withAuthentication;