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

    
  return (
    <div id='bloc-pagination' className='flex items-center justify-center rounded-sm shadow-sm bg-white'>

        <div className=" flex-1 container-description flex items-center mx-4">
            <p className='text-xl'>
                Total des donnée(s) : {liste?.length} | Données lue(s) : {  (itemsPerPage.current * currentPage.current) < liste?.length ? (itemsPerPage.current * currentPage.current) : liste?.length  }
            </p>
        </div>

        <div className="container-pagination flex items-center justify-center gap-2 mx-4">

            <button className={currentPage.current == 1 ? 'cursor-pointer duration-150 ease-in-out hover:text-blue-400 hidden' : 'cursor-pointer duration-150 ease-in-out hover:text-blue-400'} onClick={prev}>
                <span className='icon text-2xl'>
                    <i className="fas fa-arrow-left"></i>
                </span>
            </button>

            <p className='text-2xl font-semibold italic'>{description + " " + currentPage.current}</p>

            <button className={ Math.ceil(liste?.length / itemsPerPage.current) <= currentPage.current ? 'cursor-pointer duration-150 ease-in-out hover:text-blue-400 hidden' : 'cursor-pointer duration-150 ease-in-out hover:text-blue-400'} onClick={next}>
            <span className='icon text-2xl'>
                    <i className="fas fa-arrow-right"></i>
                </span>
            </button>

        </div>
    </div>
  )
}
