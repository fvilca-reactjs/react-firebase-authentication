import React from 'react'
import { withAuthorization } from '../Session'

const Home = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <p> Esta pagina es accesible por cada usuario logeado</p>
        </div>
    )
}

const condition = authUser => !!authUser; 
export default withAuthorization(condition) (Home)

