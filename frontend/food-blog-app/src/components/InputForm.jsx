import React, {use, useState} from 'react';

function InputForm(props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUp, setIsSignUp] = useState(false)

    const handleOnSubmit=(e) => {
        e.preventDefault()
        let endpoint = (isSignUp) ? "signUp" : "login"
    }


    return (
        <>

            <form className='form' onSubmit={handleOnSubmit}>
                <div className='form-control'>
                    <label>Email</label>
                    <input type="email" className="input" onChange={(e)=>setEmail(e.target.value)} required></input>
                </div>

                <div className='form-control'>
                    <label>Password</label>
                    <input type="password" className="input" onChange={(e)=>setPassword(e.target.value)} required></input>
                </div>

                <button type="submit">{(isSignUp) ? "SignUp" : "Login"}</button><br></br>
                <p onClick={()=>setIsSignUp(pre=>!pre)}>{(isSignUp) ? "Already have an account" : "Create new account"}</p>
            </form>



        </>
    );
}

export default InputForm;