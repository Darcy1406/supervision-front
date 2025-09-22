import React, { useEffect, useRef, useState } from 'react'

export default function Tableau(props){

    const [liste, setListe] = useState([]);

    let current_page = useRef(1);
    const item_par_page = 2;


    const paginate_data = () => {

        const startIndex = (current_page.current - 1) * item_par_page;
        const endIndex = startIndex + item_par_page;

        console.log('depuis le tableau', props.data);
        const currentItems = props.data.slice(startIndex, endIndex);

        setListe(currentItems);

    }


    function RenderData({item}){
        const tab = Object.values(item);
        return(
            tab.map((value, index) => (
                <td key={index}>{value}</td>
            ))
        );
    }


    function PrevPagination(){
        if (current_page.current > 1) {
            current_page.current--;
          paginate_data()
        }
    }
    
    
    function nextPagination(){
        if (current_page.current < Math.ceil(props.data.length / item_par_page)) {
            current_page.current ++;
            paginate_data();
        }
    }


    useEffect(()=>{
        paginate_data()
    }, [])

  return (
    <div>
        <table className='table is-fullwidth my-4'>
            <thead>
                <tr>
                    {
                        props.titre.map((item, index) => (
                            <th key={index}>{item}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    liste.map((item, index) => (
                        <tr>
                            <RenderData item={item} key={index}/>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        <div>
            <span className='icon'>
                <i className='fas fa-arrow-left'></i>
            </span>
            <span className='icon'>
                <i className='fas fa-arrow-right'></i>
            </span>
        </div>
    </div>
  )
}
