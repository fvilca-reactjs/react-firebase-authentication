import React from 'react'
import { AuthUserContext } from '../Session'

const Home = () => {
    return (
        <AuthUserContext.Consumer>
            {authUser=> authUser? 'Home with authUser':'Home With out AuthUser'}
        </AuthUserContext.Consumer>
    )
}

export default Home
