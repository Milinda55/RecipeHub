import React from 'react';

function Modal({children, onClose}) {
    return (
        <>
            <div className='backdrop' onClick={onClose}>
                <dialog className='modal' open>
                    {children}
                </dialog>

            </div>


        </>
    );
}

export default Modal;