import React, { Component, useContext } from 'react'
import { AuthUserContext, withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'
import Loading from '../Layout/loading'

const Home = (props) => {
    console.log('home:',props)
    return (
        <div>
            <h1>Home Page</h1>
            <p> Esta pagina es accesible por cada usuario logeado</p>

            <Messages />
        </div>
    )
}

class MessagesBase extends Component {

    state = { loading: false, messages: [], text: '' }
    static contextType = AuthUserContext;
    
    componentDidMount() {
        this.setState({ loading: true })
        this.props.firebase
            .messages()
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    console.log('querySnapshot:', querySnapshot)
                    const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    console.log('::::', data)
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

        const authUser = this.context;
        console.log('authUser:',authUser);
        this.props.firebase
            .messages()
            .add({ text: this.state.text, userId: authUser.id })
        this.setState({ text: '' })
        event.preventDefault();
    }

    render() {
        const { loading, messages, text } = this.state;
        return (
            <div>
                {loading && <Loading />}
                {messages
                    ? <MessageList messages={messages} />
                    : <p>No existen mensajes aun</p>}
                <form onSubmit={this.onCreateMessage}>
                    <input
                        type="text"
                        value={text}
                        onChange={this.onChangeText}
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    }
}

function MessageList({ messages }) {
    return (
        <div>
            {messages.map(message => (
                <MessageItem
                    key={message.id}
                    message={message} />
            ))}
        </div>
    )
}

function MessageItem({ message }) {
    return (
        <div>
            <strong>{message.userId}</strong>
            {message.text}
        </div>
    )
}


const Messages = withFirebase(MessagesBase)
const condition = authUser => !!authUser;
export default withAuthorization(condition)(Home)

