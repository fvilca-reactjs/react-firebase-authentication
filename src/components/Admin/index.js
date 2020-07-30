import React, { useState, useEffect } from 'react'
import { compose } from 'recompose';
import { withAuthorization } from '../Session'
import Loading from '../Layout/loading'
import * as ROLES from '../../constants/roles'
import { withFirebase } from '../Firebase';


/**
 * another method for get data from query is ForEach 
 */


const INITIAL_STATE = {
    loading: false,
    users: []
}

const Admin = (props) => {

    const [state, setState] = useState(INITIAL_STATE)

    useEffect(() => {
        console.log('Admin:')
        setState({ loading: true, users: [] })

        props.firebase.db.collection('Users')
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                setState({ loading: false, users: data })

            })
            .catch(error => {
                console.log("Error:", error)
            });
            return ()=>{
                
            }
    }, []);

    
    return (
        <div>
            <h1>Admin</h1>
            <p>Restricted area Only users with the admin role are authorized</p>
            {state.loading && <Loading />}
            <UserList users={state.users} />
        </div>
    )
}

const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.id}>
                <span>
                    <strong>E-Mail:</strong> {user.email}
                </span>
           -
                <span>
                    <strong>Username:</strong> {user.nombre}
                </span>
                <span>
                    <strong>Rol:</strong> {user.roles}
                </span>
            </li>
        ))}
    </ul>
);

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);
export default compose(
    withAuthorization(condition),
    withFirebase,
)(Admin)