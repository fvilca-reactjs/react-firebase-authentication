import React, { Component, useEffect, useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

/*
 * refactor: useEffect instead componentDidmount and 
 * useParam hook instead of Pathname argument in Link component
 * observation:  if you change the order in Router, the Routing don't work 
 * comparation: get or Snapshot for get data from firestore
 */

function Admin() {
    return (
        <div>
            <h1>Admin</h1>
            <p>The Admin Page is accessible by every signed in admin user.</p>

            <Switch>
                <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
                <Route path={ROUTES.ADMIN} component={UserList} />
            </Switch>
        </div>
    )
}

class UserListBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.db.collection('Users')
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                this.setState({ loading: false, users: data })

            })
            .catch(error => {
                console.log("Error:", error)
            });
    }

    componentWillUnmount() {
        //this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;

        return (
            <div>
                <h2>Users</h2>
                {loading && <div>Loading ...</div>}
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <span>
                                <strong>ID:</strong> {user.id}
                            </span>
                            <span>
                                <strong>E-Mail:</strong> {user.email}
                            </span>
                            <span>
                                <strong>Username:</strong> {user.nombre}
                            </span>
                            <span>
                                <Link
                                    to={{
                                        pathname: `${ROUTES.ADMIN}/${user.id}`,
                                        state: { user },
                                    }}
                                >
                                    Details
                </Link>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
const itemInitialState = {
    loading: false,
    user: null,
}

function UserItemBase(props) {

    const [state, setState] = useState(itemInitialState)

    useEffect(() => {
        if (state.user) {
            return;
        }
        setState({ loading: true });

        const unsubscribe = props.firebase.db
            .collection('Users')
            .doc(props.location.state.user.id)
            .onSnapshot((doc) => {
                //const data = snap.docs.map(doc => doc.data())
                console.log('doc:', doc.data())
                setState({ loading: false, user: doc.data() })
            }
            );

        /*props.firebase.db.collection('Users')
            .doc(props.location.state.user.id)
            .get()
            .then(doc => {
                setState({ loading: false, user: doc.data() })
            })
            .catch(error => {
                console.log("Error:", error)
            })*/
        return () => {
            //props.firebase.user(this.props.match.params.id).off();        
            unsubscribe();
        }
    }, [])
    const onSendPasswordResetEmail = () => {
        props.firebase.doPasswordReset(state.user.email);
    }

    const { user, loading } = state;


    return (
        <div>
            <h2 className='tit'>User ({props.match.params.id})</h2>
            {loading && <div>Loading ...</div>}

            {user && (
                <div>
                    <span>
                        <strong>ID:</strong> {user.id}
                    </span>
                    <span>
                        <strong>E-Mail:</strong> {user.email}
                    </span>
                    <span>
                        <strong>Username:</strong> {user.nombre}
                    </span>
                    <span>
                        <button
                            type="button"
                            onClick={onSendPasswordResetEmail}
                        >
                            Send Password Reset
              </button>
                    </span>
                </div>
            )}
        </div>
    )
}

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

const condition = authUser =>
    authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(condition)(Admin);