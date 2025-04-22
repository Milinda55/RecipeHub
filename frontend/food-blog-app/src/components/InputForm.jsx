import React from 'react';

function InputForm(props) {
    return (
        <>

            <form className='form'>
                <div className='form-control'>
                    <label>Email</label>
                    <input type="email" className="input" required></input>
                </div>

                <div className='form-control'>
                    <label>Password</label>
                    <input type="email" className="input" required></input>
                </div>

                <button type="submit">Login</button><br></br>
                <p>Create new account</p>
            </form>



        </>
    );
}

export default InputForm;