import React, { useContext } from 'react'
import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm from '../PasswordChange'
import { withAuthorization, AuthUserContext } from '../Session'
import defaultProfile from '../../images/default_profile.jpg'
import ImageUploader from 'react-images-upload'

const Account = (props) => {
    const auth = useContext(AuthUserContext)
    const onDrop = (files) => {
        console.log('onDrop');
        const file = files[0];
        props.firebase.saveFile(file.name, file).then(() => {
            props.firebase.getFileUrl(file.name).then((url) => {
                props.firebase.db.collection('Users')
                    .doc(auth.state.authUser.uid)
                    .set({
                        foto: url,
                    }, { merge: true })
                    .then(response => {
                        props.firebase.onAuthUserListener(
                            (authUser) => {
                                console.log('authUser:', authUser)
                                auth.setState({authUser})
                            },
                            () => {
                                console.log('jajaja');
                            }
                        )
                    })
            })
        }).catch(
            error => {
                console.log(error);
            }
        )
    }

    return (
        <AuthUserContext.Consumer>
            {auth => (
                <div>
                    <h1><strong>Account Page:</strong> </h1>
                    <img src={auth.state.authUser.foto || defaultProfile} alt='...' className='profile-img' />
                    <p>name: {auth.state.authUser.nombre}</p>
                    <p>email: {auth.state.authUser.email}</p>
                    <p>foto: {auth.state.authUser.foto}</p>
                    <ImageUploader
                        withIcon={false}
                        buttonText='Choose images'
                        singleImage={true}
                        onChange={onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />

                    <PasswordForgetForm />
                    <PasswordChangeForm />
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = (authUser) => !!authUser
export default withAuthorization(condition)(Account)
