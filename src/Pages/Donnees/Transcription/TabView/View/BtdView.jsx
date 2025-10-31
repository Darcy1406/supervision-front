import React, { useEffect, useState } from 'react'
import { formatNombreAvecEspaces, formatNumber } from '../../../../../functions/Function';

export default function BtdView({data}) {

    // Fonction qui stocker dans un state toutes les libelles des comptes de la forme { compte: libelle }
    const recuperer_libelle_des_comptes = () => {
        const initialState = data.reduce((acc, item) => {

            const numero = item['compte__numero'];
            acc[numero] = item['compte__libelle']
            return acc;

        }, {});
        delete initialState['null']
        setLibelle(initialState);
    }


    // Creer dynamique un state qui va stocker la nature et le montant pour chaque compte
    const create_dynamic_state = (data, setState) => {
        const initialState = data.reduce((acc, item) => {

            const numero = item['compte__numero'];
            acc[numero] = 0
            return acc;

        }, {});
        delete initialState['null']
        setState(initialState);
    }


    // Assigner une valeur a un item d'un state (name: nom de l'item, value: la valeur assignee a l'item, setState: le state dans lequel se trouve l'item)
    const handleChange = (name, value, setState) => {
  
        setState(prev => ({
          ...prev,
          [name]: value,
        }));
    }


    const [anterieur, setAnterieur] = useState({}); // Va stocker le montant anterieur des comptes (compte: montant)
    const [en_cours, setEnCours] = useState({});  // Va stocker le montant en cours des comptes (compte: montant)
    const [cumule, setCumule] = useState({}); //  Va stocker le montant cumule des comptes (compte: montant)
    const [total, setTotal] = useState({ // Va stocker le total des montants anterieur, en cours, cumule
        'anterieur': 0,
        'en_cours': 0,
        'cumule': 0
    });

    const [comptes, setComptes] = useState([]); // Va stocker tous les comptes a afficher dans les details (sans doublon)
    const [libelle, setLibelle] = useState({}); // Va stocker tous les libellees des comptes


    // Arranger les donnees recuperees depuis l'API et les mettre dans leur state respectif
    const arranger_les_donnees = () => {

        create_dynamic_state(data, setAnterieur);
        create_dynamic_state(data, setEnCours);
        create_dynamic_state(data, setCumule);
        recuperer_libelle_des_comptes();

        data.forEach(item => {
            if(item['nature'] == 'anterieur'){
                handleChange(item['compte__numero'], item['montant'], setAnterieur);
            }

            else if(item['nature'] == 'en_cours'){
                handleChange(item['compte__numero'], item['montant'], setEnCours);
            }

            else if(item['nature'] == 'cumule'){
                handleChange(item['compte__numero'], item['montant'], setCumule);
            }
        
            else if(item['nature'] == 'total_anterieur'){
                handleChange('anterieur', item['montant'], setTotal);
            }

            else if(item['nature'] == 'total_en_cours'){
                handleChange('en_cours', item['montant'], setTotal);
            }

            else if(item['nature'] == 'total_cumule'){
                handleChange('cumule', item['montant'], setTotal);
            }
        })
    }


    const TabItem = ({num_compte}) => {
        return (
            <tr>
                <td>{num_compte}</td>
                <td>{libelle[num_compte]}</td>
                <td className='text-lg font-semibold w-35'>{formatNombreAvecEspaces(anterieur[num_compte]) || '0,00'} Ar</td>
                <td className='text-lg font-semibold w-35'>{formatNombreAvecEspaces(en_cours[num_compte]) || '0,00'} Ar</td>
                <td className='text-lg font-semibold w-35'>{formatNombreAvecEspaces(cumule[num_compte]) || '0,00'} Ar</td>

            </tr>
        )
    }


    useEffect(() => {
        if(data){
            arranger_les_donnees();
        }
    }, [data]);

    useEffect(() => {
        setComptes(Object.keys(anterieur))
    }, [anterieur]);
    
    useEffect(() => {
        // setComptes(Object.keys(anterieur))
        // console.log(comptes);
    }, [comptes]);


  return (
    <div>
        <table className="table table-view is-fullwidth">
            <thead>
                <tr>
                    <th>Compte</th>
                    <th>Nature des opérations</th>
                    <th>Antérieur</th>
                    <th>En cours</th>
                    <th>Cumulé</th>
                </tr>
            </thead>
            <tbody>
                {
                    comptes && comptes.map((num_compte, index) => (
                        <TabItem num_compte={num_compte} key={index}/>
                    ))
                }
                <tr>
                    <td colSpan={4}>Total anterieur</td>
                    <td className='font-semibold text-lg text-blue-500'>{formatNombreAvecEspaces(total['anterieur']) || 0} Ar</td>
                </tr>
                <tr>
                    <td colSpan={4}>Total en cours</td>
                    <td className='font-semibold text-lg text-yellow-500'>{formatNombreAvecEspaces(total['en_cours']) || '0,00'} Ar</td>
                </tr>
                <tr>
                    <td colSpan={4}>Total cumule</td>
                    <td className='font-semibold text-lg text-green-500'>{formatNombreAvecEspaces(total['cumule']) || 0} Ar</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}
