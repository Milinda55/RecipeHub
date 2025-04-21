import React from 'react';

function Modal({onClose}) {
    return (
        <>
            <div className='backdrop' onClick={onClose}>
                <dialog className='modal' open>
                    <h1>Hello login</h1>
                </dialog>

            </div>


        </>
    );
}

export default Modal;