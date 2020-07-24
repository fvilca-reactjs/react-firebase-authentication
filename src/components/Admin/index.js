import React, { useState, useEffect } from 'react'
import { withAuthorization } from '../Session'
//import * as ROLES from '../../constants/roles'

const INITIAL_STATE = {
    loading: false,
    users: []
}

const Admin = (props) => {

    const [state, setState] = useState(INITIAL_STATE)

    useEffect(() => {

        setState({ loading: true, users: [] })

        props.firebase.db.collection('Users')
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                setState({ loading: false, users: data })

            })
            .catch(error => {
                console.log("Error:", error)
            })

        props.firebase.db.collection('Users')
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }, []);

    return (
        <div>
            <h1>Admin</h1>
            <p>Restricted area Only users with the admin role are authorized</p>
            {state.loading && <p>Loading...</p>}
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
            </li>
        ))}
    </ul>
);


//export default withFirebase(Admin)
const condition = authUser => authUser != null;
export default withAuthorization(condition)(Admin)

//const condition =  authUser => authUser && !!authUser.roles[ROLES.ADMIN]
//export default withAuthorization(condition)(Admin)
