export default function BtnChoice({setIsvisible, isDisabled=false}) {

    const show_button_menu = () => {
        const drop = document.getElementById('drop');
        drop.classList.toggle('is-active');  
    }


    const style = {
        position: 'relative',
        width: '192px',
        
        // transform: 'translateX(-50%)',
    }

  return (
    <div className='container-btn-choice mx-auto' style={style}>

        <div className='is-block dropdown mt-6' id='drop' onClick={show_button_menu}>

            <div className='dropdown-trigger'>

                <button type='button' className='button is-fullwidth' aria-haspopup='true' aria-controls='dropdown-menu' disabled={isDisabled}>
                    Importer un fichier
                    <span className='mx-1 is-small'>
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>

            </div>

            <div className='dropdown-menu' id='dropdown-menu' role='menu'>
                <div className="dropdown-content is-block">
                    <button type='button' className='dropdown-item' onClick={() => setIsvisible(true)}>
                        Locale
                    </button>
                    <button type='button' className='dropdown-item'>
                        G.E.D
                    </button>
                </div>
            </div>

        </div>
    </div>
  )
}
