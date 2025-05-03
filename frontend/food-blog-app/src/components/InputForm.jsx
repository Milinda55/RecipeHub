import React, {useContext, useEffect, useState} from 'react';
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
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        specialChar: false,
    });
    const isNameValid = formData.name.trim().split(/\s+/).length >= 2 && formData.name.trim().length >= 4;

    const passwordsMatch = formData.password === formData.confirmPassword;

    useEffect(() => {
        if (formData.password) {
            setPasswordRequirements({
                length: formData.password.length >= 8,
                uppercase: /[A-Z]/.test(formData.password),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
            });
        }
    }, [formData.password]);

    const isSignUpValid = isSignUp
        ? isNameValid &&
        Object.values(passwordRequirements).every(Boolean) &&
        passwordsMatch &&
        acceptedTerms
        : true;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

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