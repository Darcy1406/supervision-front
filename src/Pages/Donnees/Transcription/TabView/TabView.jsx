import { useEffect, useState } from 'react'
import { formatNumber } from '../../../../functions/Function'
import './TabView.css'; 
import TsdmtView from './View/TsdmtView';
import BtdView from './View/BtdView';
import BtrView from './View/BtrView';
import SjeView from './View/SjeView';
import BalanceView from './View/BalanceView';
import { fetchData } from '../../../../functions/fetchData';
import { API_URL } from '../../../../Config';
import BarView from './View/BarView';
import BttView from './View/BttView';
import { getCSRFToken } from '../../../../utils/csrf';


export default function TabView({data, titre, piece}){

    const [id_doc, setIdDoc] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    // const TabItem = ({item}) => {
    //     return(
    //         <tr className={item['compte__numero'] == null ? 'bg-gray-300' : null}>

    //             {
    //                 item['compte__numero'] ?
    //                 <>
    //                     <td>{item['compte__numero']}</td>
    //                     <td>{item['compte__libelle']}</td>
    //                     {/* <td><strong>{item['nature']}</strong></td> */}
    //                 </>
    //                 : <td colSpan={2}>{item['nature']}</td>
    //             }

    //             <td className='w-35'>{ item['montant'] == 0 ? "0" : formatNumber(item['montant'])} Ar</td>
    //         </tr>
    //     )
    // }

    // const telecharger_fichier = () => {
    //     setLoading(true)
    //     fetchData(`${API_URL}/data/document/telecharger`, 'post', {'action': 'telecharger_document', 'id_document': id_doc}, setResult)
    // }


    const telecharger_fichier = () => {
        const csrftoken = getCSRFToken();
    
        fetch(`${API_URL}/data/document/telecharger`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken, 
            },
            credentials: 'include',
            body: JSON.stringify({
                action: "telecharger_document",
                id_document: id_doc
            })
        })
        .then(async res => {
            if (!res.ok) throw new Error("Erreur lors du téléchargement");
    
            // Récupérer le nom du fichier depuis l'en-tête
            const disposition = res.headers.get('Content-Disposition');
            let fileName = "";
            if (disposition) {
                const match = disposition.match(/filename\*?=UTF-8''(.+)/i);
                if (match && match.length > 1) {
                    fileName = decodeURIComponent(match[1]);
                }
            }
            if (!fileName) fileName = "download"; // fallback minimal

    
            if (!fileName) {
                throw new Error("Impossible de récupérer le nom du fichier depuis le serveur");
            }
    
            const blob = await res.blob();
            return { blob, fileName };
        })
        .then(({ blob, fileName }) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName; // nom exact envoyé par le serveur
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
    };
    
    
    


    useEffect(() => {
        if(data){
            setIdDoc(data[0].document_id)
        }
    }, [data])


    useEffect(() => {
        if(result){
            if(result['succes']){
                alert(result['succes'])
                setLoading(false)
                setResult(null);
            }
        }
    }, [result])
    

  return (
    <div id='container-table'>
        {
            loading ?
                <p className='text-center text-lg my-4'>Veuillez patienter ...</p>
            :
                <p className='text-center font-semibold text-lg my-4 cursor-pointer underline text-blue-500 duration-100 ease-in-out hover:text-blue-600' style={{ whiteSpace: 'pre-line' }} onClick={telecharger_fichier}>
                    {
                        piece.toUpperCase() == 'BAR' ?
                            titre.split('; ')[0]
                        : titre
                        
                    }
                </p>
        }
        

        {
            piece ?
                piece.toUpperCase() == 'TSDMT' ?
                    <TsdmtView data={data} piece/>
                : piece.toUpperCase() == 'BTD' ?
                    <BtdView data={data}/>
                : piece.toUpperCase() == 'BTR' ?
                    <BtrView data={data}/>
                : piece.toUpperCase() == "SJE" ?
                    <SjeView data={data}/>
                : ['BOV', 'BOD'].includes(piece.toUpperCase()) ?
                    <BalanceView data={data}/>
                : piece.toUpperCase() == 'BAR' ?
                    <BarView  info_supplementaire={titre.split('; ')[1]} data={data}/>
                : piece.toUpperCase() == 'BTT' ?
                    <BttView data={data}/>
                : null
            : null
        }

    </div>
  )
}
