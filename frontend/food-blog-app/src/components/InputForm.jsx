import React, {useContext, useState} from 'react';
import axios from "axios";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext.jsx";

function InputForm({ setIsOpen }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            let endpoint = isSignUp ? "signUp" : "login";
            const res = await axios.post(`http://localhost:5000/${endpoint}`, { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            login(res.data.token, res.data.user)
            setIsOpen(false);
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back!'}</h2>
                <p>{isSignUp ? 'Join our food community' : 'Log in to your food blog account'}</p>
            </div>

            <form className='auth-form' onSubmit={handleOnSubmit}>
                <div className='form-group'>
                    <label className="input-label">
                        <FaEnvelope className="input-icon" />
                        <span>Email</span>
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            className="form-input"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>

                <div className='form-group'>
                    <label className="input-label">
                        <FaLock className="input-icon" />
                        <span>Password</span>
                    </label>
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {error && <div className='error-message'>{error}</div>}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        'Processing...'
                    ) : (
                        isSignUp ? 'Sign Up' : 'Log In'
                    )}
                </button>

                <div className="auth-footer">
                    <p>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            type="button"
                            className="switch-mode"
                            onClick={() => {
                                setIsSignUp(prev => !prev);
                                setError("");
                            }}
                        >
                            {isSignUp ? ' Log In' : ' Sign Up'}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default InputForm;