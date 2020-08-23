import React from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'
import SignOutButton from '../SignOut'
import { AuthUserContext } from '../Session'
import './navbar.scss'
import defaultProfile from '../../images/default_profile.jpg'
/**
 * refactor --> use Consumer of the context
 * refactor --> use  useContext Hook instead of Consumer
 */

const Navigation = () => (

    <AuthUserContext.Consumer>
        {auth =>
            auth.state.authUser
                ? <NavigationAuth authUser={auth.state.authUser} />
                : <NavigationNonAuth />
        }
    </AuthUserContext.Consumer>

)

const NavigationAuth = ({ authUser }) => {

    return (
        <nav> <ul className="menuItems">
            <li>
                <Link to={ROUTES.LANDING} data-item='Landing' >Landing</Link>
            </li>
            <li>
                <Link to={ROUTES.HOME} data-item='Home' >Home</Link>
            </li>
            <li>
                <Link to={ROUTES.ACCOUNT} data-item='Account'>Account</Link>
            </li>
            {authUser.roles.includes(ROLES.ADMIN) && (<li>
                <Link to={ROUTES.ADMIN} data-item='Admin'>Admin</Link>
            </li>)}
            <li>
                <SignOutButton />
            </li>
            <li>
                <img src={authUser.foto || defaultProfile} alt='...' className='profile-img' />
            </li>
        </ul></nav>
    )
}

const NavigationNonAuth = () => (
    <nav> <ul className="menuItems">
        <li>
            <Link to={ROUTES.LANDING} data-item='Landing'>Landing</Link>
        </li>
        <li>
            <Link to={ROUTES.SIGN_IN} data-item='SignIn'>SignIn</Link>
        </li>
    </ul></nav>
)

export default Navigation
