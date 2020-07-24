import React from 'react'
import { PasswordForgetForm } from '../PasswordForget'
import PasswordChangeForm from '../PasswordChange'
import { withAuthorization, AuthUserContext } from '../Session'

const Account = () => {

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <h1>Account Page: {authUser.email}</h1>
                    <PasswordForgetForm />
                    <PasswordChangeForm />
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}
const condition = (authUser) => authUser != null;

export default withAuthorization(condition)(Account)
