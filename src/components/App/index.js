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
import { withAuthentication } from '../Session'
import 'antd/dist/antd.css';

/** 
 *  @param authUser --> means that a user is trully authenticated 
 * ? onAuthStateChanged --> this observer receives a functions as parameter that acces to the authenticated user. la funcion parametro se llama cada vez que cambia  para el usuario Autenticado, es llamada cuando el usuario usa SignUp, SignIn, si es SignOut entonces authUser seria null , por tanto a quienes dependen de ella ajustaran su comportamiento.
 * ? refactor --> useEffect Hook can be use instead. with authuser as observer and remove listener
 * ?  refactor observer using await and async 
 */
class App extends Component {

    render() {
        return (
            <Router>
                <div>
                    <Navigation />
                    <hr />
                    <Route path={ROUTES.LANDING} component={Landing} exact />
                    <Route path={ROUTES.SIGN_UP} component={SignUp} />
                    <Route path={ROUTES.SIGN_IN} component={SignIn} />
                    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                    <Route path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.ACCOUNT} component={Account} />
                    <Route path={ROUTES.ADMIN} component={Admin} />
                </div>
            </Router>
        )
    }
}

//export default withFirebase(App);
export default withAuthentication(App);