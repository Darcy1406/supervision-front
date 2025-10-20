import React, { useEffect } from 'react'
import { nextPagination, prevPagination } from '../../functions/Function'

export default function Pagination({currentPage, itemsPerPage, liste, reload, setReload}) {
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
    <div id='pagination'>
        <div className="container-pagination flex items-center justify-center gap-4">

            <button className='cursor-pointer duration-150 ease-in-out hover:text-blue-400' onClick={prev}>
                <span className='icon text-2xl'>
                    <i className="fas fa-arrow-left"></i>
                </span>
            </button>

            <p className='text-xl font-semibold italic'>{currentPage.current}</p>

            <button className='cursor-pointer duration-150 ease-in-out hover:text-blue-400' onClick={next}>
            <span className='icon text-2xl'>
                    <i className="fas fa-arrow-right"></i>
                </span>
            </button>

        </div>
    </div>
  )
}
