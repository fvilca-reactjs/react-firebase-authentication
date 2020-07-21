import React from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import SignOutButton from '../SignOut'
import { AuthUserContext } from '../Session'
import './navbar.scss'
/**
 * refactor --> use Consumer of the context
 * refactor --> use  useContext Hook instead of Consumer
 */

const Navigation = () => (

    <AuthUserContext.Consumer>
        {authUser =>
            authUser
                ? <NavigationAuth />
                : <NavigationNonAuth />
        }
    </AuthUserContext.Consumer>

)

const NavigationAuth = () => (
    <nav> <ul className="menuItems">
        <li>
            <Link to={ROUTES.LANDING} >Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.HOME} data-item='Home' >Home</Link>
        </li>
        <li>
            <Link to={ROUTES.ACCOUNT} >Account</Link>
        </li>
        <li>
            <SignOutButton />
        </li>
    </ul></nav>
)
const NavigationNonAuth = () => (
    <nav> <ul className="menuItems">
        <li>
            <Link to={ROUTES.LANDING} >Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN} >Sign In</Link>
        </li>
        </ul></nav>
)

export default Navigation
