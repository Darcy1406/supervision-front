import { useEffect } from 'react'
import './Pagination.css';
import { nextPagination, prevPagination } from '../../functions/Function'

export default function Pagination({description="", currentPage, itemsPerPage, liste, reload, setReload}) {
    let current = 0;

    const prev = () => {
        current = prevPagination(currentPage.current);
        currentPage.current = current;
        setReload(!reload);
    }


    const next = () => {
        current = nextPagination(currentPage.current, itemsPerPage.current, liste);
        currentPage.current = current;
        setReload(!reload);
    }


    const reset_pagination = () => {
        currentPage.current = 1;
        setReload(!reload)
    }

    
  return (
    <div id='bloc-pagination' className='flex items-center justify-center bg-white'>

        <div className=" flex-1 container-description flex items-center mx-4">
            <p className='text-xl'>
                Total des donnée(s) : {liste?.length} | Données lue(s) : {  (itemsPerPage.current * currentPage.current) < liste?.length ? (itemsPerPage.current * currentPage.current) : liste?.length  }
            </p>
        </div>

        <div className="container-pagination flex items-center justify-center gap-6 mx-4">

            <p className='text-xl'>{description + " " + currentPage.current + " sur " + Math.ceil(liste?.length / itemsPerPage.current)}</p>

            <div className="contrainer-btn flex items-center gap-1">

                <button className={`button`} onClick={prev} disabled={currentPage.current == 1}>
                    <span className='icon text-2xl'>
                        <i className="fas fa-chevron-left"></i>
                    </span>
                </button>

                <button className='button is-link' onClick={reset_pagination}>
                    1
                </button>

                <button className={ 'button'} onClick={next} disabled={Math.ceil(liste?.length / itemsPerPage.current) <= currentPage.current}>
                <span className='icon text-2xl'>
                        <i className="fas fa-chevron-right"></i>
                    </span>
                </button>

            </div>


        </div>
    </div>
  )
}
