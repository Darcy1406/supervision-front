import './InputNumber.css';
import { formatNombreAvecEspaces } from '../../functions/Function';


export default function InputNumber({value, handleChange, placeholder="montant"}) {
    // useEffect(() => {
    //     console.log('value', value || 0);
    // }, [value]) 

  return (

    <input 
        className='input-number w-5/6 outline-none border-b-2 border-gray-300'
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        pattern='^[0-9,\s]+$'
    />
   
  )
}
