import React, { useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { useContext } from 'react'
import GoogleLogin from 'react-google-login'
import axios from 'axios'


export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const { loading, request, error, clearError } = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        console.log('Error: ', error)
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/registration', 'POST', { ...form })
            message(data.message)
        } catch (e) {

        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', { ...form })
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }

    const responseSuccessGoogle = async (response) => {
        axios.post('http://localhost:5000/api/auth/googleauth', { tokenId: response.tokenId }).then((response) => {
            auth.login(response.data.token, response.data._id)
        })
    }

    const responseErrorGoogle = (response) => {

    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Input email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    onChange={changeHandler}
                                />

                                <input
                                    placeholder="Input password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    onChange={changeHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn green darken-2"
                            style={{ marginRight: 10 }}
                            onClick={loginHandler}
                            disabled={loading}
                        >
                            Log in
                        </button>

                        <button
                            className="btn blue darken-2"
                            style={{ marginRight: 10 }}
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Sign up
                        </button>

                        <GoogleLogin
                            clientId="647404905515-cor9dhjn50b0p4emrjqu8su48tle37np.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            onSuccess={responseSuccessGoogle}
                            onFailure={responseErrorGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}