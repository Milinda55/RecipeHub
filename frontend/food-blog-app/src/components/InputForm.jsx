import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheck, FaTimes} from 'react-icons/fa';
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext.jsx";
import Lottie from 'lottie-react';
import successAnimation from '../assets/success-animation.json';
import errorAnimation from '../assets/error-animation.json';

function InputForm({setIsOpen}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(null);
    const {login} = useContext(AuthContext);
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
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        setError("");
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const endpoint = isSignUp ? "signUp" : "login";
            const payload = isSignUp
                ? {name: formData.name, email: formData.email, password: formData.password}
                : {email: formData.email, password: formData.password};
            const res = await axios.post(`http://localhost:5000/${endpoint}`, payload);

            setShowFeedback('success');

            setTimeout(() => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                login(res.data.token, res.data.user)
                setIsOpen(false);
                navigate("/")
            }, 1500)
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred");
            setShowFeedback('error');
            setTimeout(() => setShowFeedback(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    if (showFeedback) {
        return (
            <div className="auth-modal-container">
                <div className="auth-container">
                    <div className="feedback-animation">
                        <Lottie
                            animationData={showFeedback === 'success' ? successAnimation : errorAnimation}
                            loop={false}
                            style={{ height: 150 }}
                        />
                        <h3>{showFeedback === 'success' ? 'Success!' : 'Error'}</h3>
                        <p>
                            {showFeedback === 'success'
                                ? isSignUp ? 'Account created successfully!' : 'Logged in successfully!'
                                : error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-modal-container">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>{isSignUp ? 'Create Account' : 'Welcome Back!'}</h2>
                    <p>{isSignUp ? 'Join our food community' : 'Log in to your food blog account'}</p>
                </div>

                <form className='auth-form' onSubmit={handleOnSubmit}>
                    <div className="form-scroll-container">
                        {isSignUp && (
                            <div className='form-group'>
                                <label className="input-label">
                                    <FaUser className="input-icon"/>
                                    <span>Full Name</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-input ${formData.name && !isNameValid ? 'invalid' : ''}`}
                                        onChange={handleChange}
                                        placeholder="Amila Prasad"
                                        required
                                    />
                                    {formData.name && (
                                        <span className="validation-icon">
                                    {isNameValid ? <FaCheck className="valid"/> : <FaTimes className="invalid"/>}
                                </span>
                                    )}
                                </div>
                                {formData.name && !isNameValid && (
                                    <small className="hint">Must be at least 2 words and 4 characters</small>
                                )}
                            </div>)}

                        <div className='form-group'>
                            <label className="input-label">
                                <FaLock className="input-icon"/>
                                <span>Email</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="password-fields-container">
                            <div className='form-group'>
                                <label className="input-label">
                                    <FaLock className="input-icon"/>
                                    <span>Password</span>
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-input"
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </button>
                                </div>

                                {isSignUp && formData.password && (
                                    <div className="password-strength">
                                        <div className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
                                            {passwordRequirements.length ? <FaCheck/> : <FaTimes/>}
                                            <span>8+ characters</span>
                                        </div>
                                        <div className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
                                            {passwordRequirements.uppercase ? <FaCheck/> : <FaTimes/>}
                                            <span>Uppercase letter</span>
                                        </div>
                                        <div className={`requirement ${passwordRequirements.specialChar ? 'met' : ''}`}>
                                            {passwordRequirements.specialChar ? <FaCheck/> : <FaTimes/>}
                                            <span>Special character</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isSignUp && (
                                <div className='form-group'>
                                    <label className="input-label">
                                        <FaLock className="input-icon"/>
                                        <span>Confirm Password</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className={`form-input ${formData.confirmPassword && !passwordsMatch ? 'invalid' : ''}`}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && !passwordsMatch && (
                                        <small className="hint">Passwords don't match</small>
                                    )}
                                </div>
                            )}
                        </div>

                        {isSignUp && (
                            <div className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <label htmlFor="acceptTerms">
                                    I accept the <a href="/terms" target="_blank">Terms and Conditions</a>
                                </label>
                            </div>
                        )}
                    </div>

                    {error && <div className='error-message'>{error}</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading || (isSignUp && !isSignUpValid)}
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
                                    setFormData({
                                        name: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: ''
                                    });
                                }}
                            >
                                {isSignUp ? ' Log In' : ' Sign Up'}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InputForm;