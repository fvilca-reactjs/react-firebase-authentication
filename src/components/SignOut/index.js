import React from 'react'
import { withFirebase } from '../Firebase'

/* @author {firebase} req 
 * @param  firebase object passed as context consumer
 * @params: 
 */

const SignOutButton = ({firebase}) => (
        <button onClick={firebase.doSignOut}> 
            SignOut
        </button>
    )

export default withFirebase(SignOutButton)
