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

        state = { authUser: null }

        componentDidMount() {

            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (authUser) {

                        this.props.firebase.db.collection('Users')
                            .doc(authUser.uid)
                            .get()
                            .then(doc => {
                                authUser={
                                    uid:authUser.uid,
                                    email:authUser.email,
                                    ...doc.data()
                                }  
                                this.setState({ authUser })
                            })
                            .catch(error => {
                                console.log("Error:", error)
                            });

                        
                    } else {
                        this.setState({ authUser: null });
                    }
                })
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            console.log('withAthentication: AuthUser:', this.state.authUser)
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