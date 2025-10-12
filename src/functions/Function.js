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