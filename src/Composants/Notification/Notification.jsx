export default function Notification({notification}) {
  return ( 
    <>
        {
            notification && notification.map((item, index) => (
            <div key={index} className='bg-white px-2 py-4 mx-2 mb-2 border-b border-gray-300 shadow-sm cursor-pointer rounded-lg duration-150 ease-in-out hover:bg-gray-100'>
                <p>
                  {item['utilisateur__nom'] + " " + item['utilisateur__prenom'] + " " + item['action'] + " le " + item['created_at']} 
                  
                </p>
            </div>

            ))
        }
    </>
  )
}
