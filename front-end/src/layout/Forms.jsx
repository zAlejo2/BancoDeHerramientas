import React from 'react'

export const Forms = ({ children }) => {
    return (

        <section className='w-[90%] md:max-w-[85%] mt-10 border border-neutral-400/40 m-4 p-6 shadow-lg shadow-[#1565c023] rounded-lg'>
            {children}
        </section>
    )
}
