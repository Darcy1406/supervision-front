import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { API_URL } from '../../Config';
import { sendData } from '../../functions/sendData';
import { Alert } from '../../Composants/Alert/Alert';
import { useNavigate } from 'react-router-dom';

export default function ComptePiece() {
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(true);
  const [result, setResult] = useState("");

  const [nb_nature, setNbNature] = useState(1);
  const [nature, setNature] = useState(Array(nb_nature).fill(""));

  const [piece, setPiece] = useState("");
  const [compte, setCompte] = useState("");


  const handleChange = (index, value) => {
    const newNature = [...nature];
    newNature[index] = value;
    setNature(newNature);
  };


  const clear_champ = () => {
    setNbNature(1);
    setPiece("");
    setCompte("");
    setNature(Array(nb_nature).fill(""));
  }


  const add_nature = () => {
    setNbNature(nb_nature + 1);
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    sendData(`${API_URL}/data/piece_compte/creer`, 'post', {piece, compte, nature, "action": "ajouter"}, setResult);
    clear_champ();
  }


  const {data: pieces} = useFetch(`${API_URL}/data/piece/get_pieces`, 'get', {}, refresh);

  const {data: num_comptes} = useFetch(`${API_URL}/data/compte/get_number`, 'get', {}, refresh);


  useEffect(() => {
    if(nb_nature > 1){
      setNature(prev => [
        ...prev,
        ...Array(nb_nature - prev.length).fill("")
      ]);
    }
  }, [nb_nature]);


  return (
    <div id='compte-piece' className='px-4 w-2/3 mx-auto'>

      <div className='container-btn-liste mt-5 text-white'>
        <button className='bg-black px-4 py-2 rounded-sm shadow-sm cursor-pointer duration-150 ease-in-out hover:text-gray-500' onClick={() => navigate('/main/compte_piece_list') }>
          <span className='icon'>
            <i className='fas fa-book'></i>
          </span>
          Liste des liaisons
        </button>
      </div>

      <div className="container-form w-3/4 mx-auto">

        <h2 className='title is-4 my-5'>Lier un compte à une piece</h2>
        <p className='subtitle is-6'>Veuillez remplir le formulaire pour ajouter un compte a une piece comptable en remplissant le formulaire ci-dessous.</p>

        <form onSubmit={(e) => handleSubmit(e)} className='px-4'>

          {/* Piece */}
          <div className="field">
            <div className="control">
              <label className="label">Pièce</label>
              <select className='w-full p-2 border border-gray-300 rounded-sm bg-white shadow-sm' value={piece} onChange={(e) => setPiece(e.target.value)}>
                <option value="">Chosissez la pièce</option>
                {
                  pieces && pieces.map((item, index) => (
                    <option key={index} value={item['pk']}>{item['fields']['nom_piece']}</option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* Compte */}
          <div className="field">
            <div className="control">
              <label className="label">Compte</label>

              <input list="compte" className='input' placeholder="De quel compte s'agit-il ?" value={compte} onChange={(e) => setCompte(e.target.value)}/>
              <datalist id="compte">
                {
                  num_comptes && num_comptes.map((item, index) => (
                    <option key={index} value={item['numero']} />
                  ))
                }
              </datalist>
            </div>
          </div>

          {/* Nature */}
          <div className="field">
            <div className="control">
              <label className='label'>Nature</label>
              <div>
                <button type='button' className='block my-2 cursor-pointer text-blue-500 duration-150 ease-out hover:text-blue-600' onClick={add_nature}>
                  <span className='icon text-xl'>
                    <i className="fas fa-plus"></i>
                  </span>
                </button>
                {
                    Array.from({length: nb_nature}, (_, i) => (
                      <input key={i} type="text" className='border-b-2 border-gray-400 w-1/2 block outline-none' placeholder='Entrer la nature' value={nature[i] ?? ""} onChange={(e) => handleChange(i, e.target.value)}/>
                    ))
                }
              </div>
            </div>
          </div>

          <div className="container-btn my-6">
            <button type='submit' className='bg-orange-400 px-6 py-2 rounded-sm cursor-pointer text-white durtion-200 ease-in-out hover:bg-orange-500'>
              Creer
            </button>
          </div>

        </form>
      </div>


      {
        result ? 
          <Alert message={result['message']} setMessage={setResult} icon='fas fa-check-circle' bgColor='bg-green-300' />
        : null
      }

    </div>
  )
}
