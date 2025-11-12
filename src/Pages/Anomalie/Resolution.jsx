export default function Resolution({handleSubmit, commentaire, setCommentaire}) {
  return (
    <div id='resolution'>
        
        <div className="bloc-form p-2">
            <form onSubmit={handleSubmit}>
                <p className='text-center my-2 text-xl font-semibold italic'>Renseignement</p>
                <div className="field">
                    <div className="control">
                        <label className='label'>Commentaire</label>
                        <textarea className='textarea' placeholder="Veuillez noter la manière dont l'anomalie a été resolue" required value={commentaire} onChange={(e) => setCommentaire(e.target.value)}></textarea>
                    </div>
                </div>


                <button type="submit" className='button is-dark'>Valider</button>

            </form>
        </div>

    </div>
  )
}
