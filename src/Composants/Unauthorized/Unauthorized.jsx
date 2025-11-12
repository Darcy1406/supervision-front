import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {

    const navigate = useNavigate();

  return (
    <div id='unauthorized' className='flex justify-center items-center h-screen'>

        <div className='w-1/2'>
            {/* <p style={{fontSize: '40px'}} className='uppercase bg-yellow-200 p-6 font-bold shadow-sm rounded-lg'>      
                <span className='icon text-red-500 mx-4'>
                    <i className='fas fa-times'></i>
                </span>
                (401) Non autorise
            </p>
            <p className='text-center py-4 text-xl'>
                Vous n'est pas autorisez a interagir avec cette page
            </p>

            <button className='button is-dark is-pulled-right m-4'>Revenir</button> */}

            <span style={{fontSize: '70px'}} className='is-block text-center'>
                <i class="fas fa-users-slash"></i>
            </span>

            <p className='is-block text-center font-bold font-bold text-5xl text-blue-500 mt-2 mb-4'>401</p>

            <p className='is-block text-center font-bold text-4xl text-blue-900 font-light'>Non autorisé</p>
            
            <p className='is-block text-center font-bold text-2xl mt-4 text-blue-900 font-light'>Vous n'êtes pas autorisé à interagir avec cette page</p>

            <button className='bg-blue-900 is-rounded px-6 py-2 text-white rounded-2xl is-block mx-auto my-6 cursor-pointer' onClick={() => navigate('/main/dashboard')}>
                Allez à l'accueil
            </button>

            
        </div>

    </div>
  )
}
