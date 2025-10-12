import React from 'react'

export function Checkbox({label, isChecked, setIschecked}) {
  return (
    
      <label htmlFor="" className='mx-4'>
        <input type="checkbox" name="" id="" checked={isChecked} onChange={() => setIschecked(!isChecked) }/>
        {label}
      </label>
  )
}
