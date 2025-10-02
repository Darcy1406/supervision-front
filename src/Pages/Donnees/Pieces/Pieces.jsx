import React from 'react'

export default function Pieces() {
  return (
    <div id='piece'>
        <p className='text-2xl font-semibold bg-gray-100 py-4 px-6'>Liste des pieces comptables</p>

        <div className='container-table w-3/4 mx-auto my-2'>
            <button className='bg-black px-4 py-2 text-white cursor-pointer rounded-lg my-2'>
                <span className='icon'>
                    <i className='fas fa-plus'></i>
                </span>
                Ajouter une piece
            </button>
            <table className='table is-fullwidth is-hoverable'>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Periode</th>
                        <th>Liste des postes comptables</th>
                        <th>Date de creation</th>
                        <th>Date de modification</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Teste</td>
                        <td>Decade</td>
                        <td>P1, P2, P3, P4</td>
                        <td>2025/10/02</td>
                        <td>2025/10/02</td>
                        <td>
                            <div>
                                <button className='button is-small is-success'>
                                    <span className='icon mx-1'>
                                        <i className='fas fa-edit'></i>
                                    </span>
                                    Modifier
                                </button>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>Teste</td>
                        <td>Decade</td>
                        <td>P1, P2, P3, P4</td>
                        <td>2025/10/02</td>
                        <td>2025/10/02</td>
                        <td>
                            <div>
                                <button className='button is-small is-success'>
                                    <span className='icon mx-1'>
                                        <i className='fas fa-edit'></i>
                                    </span>
                                    Modifier
                                </button>
                            </div>
                        </td>
                    </tr>
                    
                   
                </tbody>
            </table>
        </div>

    </div>
  )
}
