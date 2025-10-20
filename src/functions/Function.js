/**
 * 
 * @param {number} num 
 * @return {string} (retourne le nombre formatee. EX: 25960000 => 25 960 000)
 */

export const formatNumber = (num) => {
    if (!num) return "";
    const clean = num.toString().replace(/\s+/g, ""); // Supprimer les espaces avant de reformater
    
    const numeric = clean.replace(/\D/g, ""); // Ne garder que les chiffres
    
    return (numeric.replace(/\B(?=(\d{3})+(?!\d))/g, " ")); // Ajouter un espace tous les 3 chiffres à partir de la fin
};


export const paginateData = (currentPage, itemsPerPage, data, setItem) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = data.slice(startIndex, endIndex)

  setItem(currentItems);

}


export const prevPagination = (currentPage) => {
  if(currentPage > 1){
    currentPage = currentPage - 1;
    return currentPage
  }
  return currentPage;
}


export const nextPagination = (currentPage, itemsPerPage, data) => {
  if(currentPage < Math.ceil(data.length / itemsPerPage)){
    currentPage = currentPage + 1;
    return currentPage;
  }
  return currentPage;
}


export const month_int_to_string = (month) => {
  let month_string = "";
  switch(month){
    case '01':  month_string += 'Janvier'; break;
    case '02':  month_string += 'Fevrier'; break;
    case '03':  month_string += 'Mars'; break;
    case '04':  month_string += 'Avril'; break;
    case '05':  month_string += 'Mai'; break;
    case '06':  month_string += 'Juin'; break;
    case '07':  month_string += 'Juillet'; break;
    case '08':  month_string += 'Aout'; break;
    case '09':  month_string += 'Septembre'; break;
    case '10':  month_string += 'Octobre'; break;
    case '11':  month_string += 'Novembre'; break;
    case '12':  month_string += 'Decembre';
  }

  return month_string;
}