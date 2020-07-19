import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navigation from '../Navigation'
import * as ROUTES from '../../constants/routes'
import Landing from '../Landing'
import SignUp from '../SignUp'
import SignIn from '../SignIn'
import PasswordForget from '../PasswordForget'
import Home from '../Home'
import Account from '../Account'
import Admin from '../Admin'
import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'

/** 
 * ? onAuthStateChanged --> this function receives a functions as parameter that acces to the authenticated user. la funcion parametro se llama cada vez que cambia  para el usuario Autenticado, es llamada cuando el usuario usa SignUp, SignIn, si es SignOut entonces authUser seria null , por tanto a quienes dependen de ella ajustaran su comportamiento.
 * ? refactor --> useEffect Hook can be use instead.
 * ? refactor --> provider could be used  in the father component.
 */
class App extends Component {

    state = { authUser: null }

    componentDidMount() {
        console.log('did:Mount:')
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                console.log(' change authuser', authUser)
                authUser
                    ? this.setState({ authUser })
                    : this.setState({ authUser: null });
            })
    }

    componentWillUnmount() {
        this.listener();
    }
    render() {

        return (
            <AuthUserContext.Provider value={this.state.authUser}>
                <Router>
                    <Navigation />
                    <Route path={ROUTES.LANDING} component={Landing} exact />
                    <Route path={ROUTES.SIGN_UP} component={SignUp} />
                    <Route path={ROUTES.SIGN_IN} component={SignIn} />
                    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                    <Route path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.ACCOUNT} component={Account} />
                    <Route path={ROUTES.ADMIN} component={Admin} />
                </Router>
            </AuthUserContext.Provider>
        )
    }
}

export default withFirebase(App);
