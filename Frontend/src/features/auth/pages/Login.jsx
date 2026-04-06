import React,{useEffect, useState} from 'react'
import { useNavigate, Link, useLocation } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, user, handleLogin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")
    const returnTo = location.state?.returnTo || "/"
    const shouldRestoreGenerationDraft = Boolean(location.state?.restoreGenerationDraft)
    const loginHint = location.state?.reason === "login_required_for_generation"
        ? (location.state?.message || "Please login to continue.")
        : ""

    useEffect(() => {
        if (user) {
            navigate(returnTo, {
                replace: true,
                state: shouldRestoreGenerationDraft ? { restoreGenerationDraft: true } : null
            })
        }
    }, [ user, navigate, returnTo, shouldRestoreGenerationDraft ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleLogin({email,password})
            navigate(returnTo, {
                replace: true,
                state: shouldRestoreGenerationDraft ? { restoreGenerationDraft: true } : null
            })
        } catch (err) {
            setError(err?.response?.data?.message || "Login failed. Please try again.")
        }
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }


    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                {loginHint && <p style={{ color: "#555" }}>{loginHint}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>
                    <button className='button primary-button' >Login</button>
                </form>
                {error && <p style={{ color: "crimson" }}>{error}</p>}
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    )
}

export default Login