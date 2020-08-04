import React, { Component } from 'react'
import { AuthUserContext, withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'
import Loading from '../Layout/loading'

/*
refactor: useContext, and 
!refactor Message base: instead of Component didmount, use UseEffect as observer to fecth data 
*/
const Home = (props) => {
    console.log('home:', props)
    return (
        <div>
            <h1>Home Page</h1>
            <p> Esta pagina es accesible por cada usuario logeado</p>

            <Messages />
        </div>
    )
}

class MessagesBase extends Component {

    state = {
        loading: false,
        messages: [],
        text: '',
        limit: 5
    }
    static contextType = AuthUserContext;


    componentDidMount() {
        this.setState({ loading: true })
        this.props.firebase
            .messages()
            .orderBy('createdAt')
            //.limit(this.state.limit)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    this.setState({ loading: false, messages: data })
                } else {
                    this.setState({ loading: false, messages: null })
                }

            })
            .catch(error => console.log(error))
    }
    componentWillUnmount() {
        //unsubscribe();
    }

    onChangeText = ({ target }) => {
        this.setState({ text: target.value })
    }
    onCreateMessage = (event) => {
        event.preventDefault();
        const authUser = this.context;
        //console.log('authUser:', authUser);
        if (this.state.text) {
            this.props.firebase
                .messages()
                .add({
                    text: this.state.text,
                    userId: authUser.id,
                    createdAt: this.props.firebase.timestamp
                })
                .then((response) => {
                    console.log('Exito', response)
                })
                .catch((error) => {
                    console.log('error:', error)
                })
            this.setState({ text: '' })

        }
        //this.setState({...this.state, messages:});

    }
    onRemoveMessage = (id) => {
        console.log('id message', id)
        //const promise = await this.props.firebase.message(id).delete();
        this.props.firebase.message(id)
            .delete()
            .then(() => { console.log("successfully deleted! ") })
            .catch((error) => { console.log("Error removing document:", error) })
    }
    onEditMessage = (message, text) => {
        this.props.firebase
            .message(message.id)
            .set({
                ...message,
                text,
                editedAt: this.props.firebase.timestamp
            })
    }


    render() {
        //const {users} = this.props;
        const authUser = this.context;
        const { loading, messages, text, limit } = this.state;
        return (
            <div>
                {limit}
                {loading && <Loading />}
                {messages
                    ? (<MessageList
                        authUser={authUser}
                        messages={messages}
                        onRemoveMessage={this.onRemoveMessage}
                        onEditMessage={this.onEditMessage}
                    />)
                    : <p>No existen mensajes aun</p>
                }
                <form>
                    <input
                        type="text"
                        value={text}
                        onChange={this.onChangeText}
                    />
                    <button onClick={this.onCreateMessage}>Send</button>
                </form>
            </div>
        )
    }
}

function MessageList({ authUser, messages, onRemoveMessage, onEditMessage }) {
    return (
        <div>
            {messages.map(message => (
                <MessageItem
                    authUser={authUser}
                    key={message.id}
                    message={message}
                    onRemoveMessage={onRemoveMessage}
                    onEditMessage={onEditMessage}
                />
            ))}
        </div>
    )
}

class MessageItem extends Component {
    state = {
        editMode: false,
        editText: this.props.message.text
    }
    onToggleEditMode = () => {
        this.setState({
            editMode: !this.state.editMode,
            editText: this.props.message.text,
        })

    }
    onChangeEditText = ({ target }) => {
        this.setState({ editText: target.value })
    }
    onSaveEditText = (event) => {
        this.props.onEditMessage(this.props.message, this.state.editText)
        this.setState({ editMode: false })
    }


    render() {
        const { authUser, message, onRemoveMessage } = this.props;
        console.log('item:', message);
        const { editText, editMode } = this.state;
        return (
            <div>

                {editMode
                    ? <input value={editText} onChange={this.onChangeEditText} />
                    : (<>
                        <strong> {message.userId} </strong>
                        <span> {message.text} </span>
                        {message.editedAt
                            ? <span>{message.editedAt.toDate().toDateString()}-(Edited)</span>
                            : null
                        }
                        </>
                    )
                }
                {authUser.uid === message.userId && (
                    <>
                        {editMode
                            ? (<>
                                <button onClick={this.onSaveEditText} >Save</button>
                                <button onClick={this.onToggleEditMode}>Reset</button>
                            </>
                            )
                            : <button onClick={this.onToggleEditMode} >Edit</button>
                        }
                    </>
                )}

                {
                    !editMode && <button onClick={() => onRemoveMessage(message.id)} className='delete'>Delete</button>
                }
            </div>
        )
    }
}


const Messages = withFirebase(MessagesBase)
const condition = authUser => !!authUser;
export default withAuthorization(condition)(Home)

