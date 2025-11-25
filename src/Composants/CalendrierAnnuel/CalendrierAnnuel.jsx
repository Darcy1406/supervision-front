// import { useMemo, useState, useEffect } from "react";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import fr from "date-fns/locale/fr";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "./CalendrierAnnuel.css";

// const locales = { fr };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
//   getDay,
//   locales,
// });

// export default function CalendrierAnnuel({ data = [], setYear, year, setAnomalies }) {

//   // --- Analyse et transformation des données ---
//   const { statusMap, anomaliesTemp } = useMemo(() => {
//     if (!data || data.length === 0) return { statusMap: {}, anomaliesTemp: null };

//     const mapDates = {};
//     data.forEach((item) => {
//       const parts = item.document__nom_fichier.split(",");
//       const dateString = parts[parts.length - 1].trim(); // ex: "2025-11-04"

//       if (!mapDates[dateString]) mapDates[dateString] = {};

//       // Convertir le montant en nombre
//       mapDates[dateString][item.nature] = {
//         montant: parseFloat(item.montant),
//         fichier: item.document__nom_fichier
//       };
//     });

//     const datesTriees = Object.keys(mapDates).sort();
//     const statusMap = {};
//     const anomaliesTemp = [];

//     for (let i = 0; i < datesTriees.length; i++) {
//       const dateCourante = datesTriees[i];
//       const datePrecedente = datesTriees[i - 1];
//       const courant = mapDates[dateCourante];
//       const precedent = mapDates[datePrecedente];

//       let status = "conge"; // vert par défaut

//       if (datePrecedente && courant.report && precedent && precedent.solde) {
//         // Vérifier que la date précédente est exactement d-1
//         const [yC, mC, dC] = dateCourante.split("-").map(Number);
//         const [yP, mP, dP] = datePrecedente.split("-").map(Number);

//         const dateCour = new Date(yC, mC - 1, dC);
//         const datePrev = new Date(yP, mP - 1, dP);

//         const diffDays = (dateCour - datePrev) / (1000 * 60 * 60 * 24);

//         if (diffDays === 1) {
//           // Comparer report / solde seulement si date consécutive
//           if (courant.report.montant !== precedent.solde.montant) {
//             status = "alerte";
//             anomaliesTemp.push({
//               date: dateCourante,
//               description: `L'encaisse fin de journée du ${datePrecedente} (${precedent.solde.montant.toLocaleString('fr-FR')}) ne correspond pas au report de la journée du ${dateCourante} (${courant.report.montant.toLocaleString('fr-FR')}) dans le fichier "${courant.report.fichier}"`,
//               fichier: [courant.report.fichier],
//               analyse: 'report_sje'
//             });
//           }
//         }
//         // Sinon diffDays != 1 → on laisse vert
//       }

//       statusMap[dateCourante] = status;
//     }

//     return { statusMap, anomaliesTemp };
//   }, [data]);

//   // --- Mettre à jour le state parent avec les anomalies ---
//   useEffect(() => {
//     if (setAnomalies) {
//       setAnomalies(anomaliesTemp);
//       console.log('anomalie', anomaliesTemp);
//     }
//   }, [anomaliesTemp, setAnomalies]);

//   // --- Tableau des 12 mois ---
//   const months = useMemo(() => Array.from({ length: 12 }).map((_, i) => i), []);

//   // --- Préparer events pour react-big-calendar ---
//   const events = useMemo(() => {
//     return Object.keys(statusMap).map((dateStr) => {
//       const [y, m, d] = dateStr.split("-").map(Number);
//       const dateObj = new Date(y, m - 1, d); // création en heure locale
//       return {
//         start: dateObj,
//         end: dateObj,
//         title: "",
//         type: statusMap[dateStr]
//       };
//     });
//   }, [statusMap]);

//   function eventsForMonth(monthIndex) {
//     return events.filter((ev) => {
//       const s = ev.start;
//       const monthStart = new Date(year, monthIndex, 1);
//       const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59);
//       return s >= monthStart && s <= monthEnd;
//     });
//   }

//   function eventPropGetter(event) {
//     return { style: { display: "none" } };
//   }

//   function dayPropGetter(date) {
//     // clé locale correspondant exactement au format "YYYY-MM-DD"
//     const key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
//     const status = statusMap[key];
//     if (!status) return {}; // ne pas colorier si pas de données

//     return {
//       style: status === "conge"
//         ? { backgroundColor: "yellowgreen" }
//         : { backgroundColor: "orange" }
//     };
//   }

//   const [poste_comptable, setPosteComptable] = useState("");

//   return (
//     <div className="calendar-year-container">
//       <div className="months-grid">
//         <div className="flex flex-wrap gap-2 justify-center items-center">
//           {months.map((m) => (
//             <section key={m} className="w-55 month-card">
//               <div className="month-title">
//                 {new Date(year, m, 1).toLocaleDateString("fr-FR", {
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </div>

//               <Calendar
//                 localizer={localizer}
//                 events={eventsForMonth(m)}
//                 startAccessor="start"
//                 endAccessor="end"
//                 defaultView="month"
//                 views={["month"]}
//                 toolbar={false}
//                 popup={false}
//                 eventPropGetter={eventPropGetter}
//                 dayPropGetter={dayPropGetter}
//                 style={{ height: 200, backgroundColor: "white" }}
//                 date={new Date(year, m, 1)}
//               />
//             </section>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useMemo, useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendrierAnnuel.css";

// --- Localisation calendrier ---
const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendrierAnnuel({ data = [], setYear, year, setAnomalies }) {
  // Helper: format local date -> "YYYY-MM-DD" (sans toISOString)
  function ymdFromDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // --- Analyse et transformation des données (avec gestion week-end) ---
  const { statusMap, anomaliesTemp } = useMemo(() => {
    if (!data || data.length === 0) return { statusMap: {}, anomaliesTemp: null };

    const mapDates = {};

    // Regrouper les données par date (clé "YYYY-MM-DD" fournie dans le nom du fichier)
    data.forEach((item) => {
      const parts = item.document__nom_fichier.split(",");
      const dateString = parts[parts.length - 1].trim(); // ex: "2025-11-04"
      if (!dateString) return; // sécurité

      if (!mapDates[dateString]) mapDates[dateString] = {};
      // Protection : parseFloat peut renvoyer NaN si montant invalide
      const montant = Number.isFinite(Number(item.montant)) ? parseFloat(item.montant) : NaN;

      mapDates[dateString][item.nature] = {
        montant,
        fichier: item.document__nom_fichier,
      };
    });

    const datesTriees = Object.keys(mapDates).sort();
    const statusMap = {};
    const anomaliesTemp = [];

    // Parcours de toutes les dates triées
    for (let i = 0; i < datesTriees.length; i++) {
      const dateCourante = datesTriees[i];
      const courant = mapDates[dateCourante] || {};

      let status = "conge"; // vert par défaut

      // Convertir la date courante en objet Date local
      const [yC, mC, dC] = dateCourante.split("-").map(Number);
      if (![yC, mC, dC].every(Number.isFinite)) {
        // clé mal formée : on marque vert et continue
        statusMap[dateCourante] = status;
        continue;
      }
      const currentDateObj = new Date(yC, mC - 1, dC);
      const dayOfWeek = currentDateObj.getDay(); // 0=dimanche, 1=lundi, ..., 5=vendredi

      let dateAVerifierKey = null;
      let precedent = null;

      // --- Cas spécial : si c'est un lundi, essayer de comparer avec le vendredi précédent ---
      if (dayOfWeek === 1) {
        const vendredi = new Date(currentDateObj);
        vendredi.setDate(vendredi.getDate() - 3); // recule de 3 jours -> vendredi
        const vendrediKey = ymdFromDate(vendredi);

        // Vérifier que la structure contient bien solde pour le vendredi et report pour le lundi
        if (
          mapDates[vendrediKey] &&
          courant.report &&
          mapDates[vendrediKey].solde &&
          Number.isFinite(courant.report.montant) &&
          Number.isFinite(mapDates[vendrediKey].solde.montant)
        ) {
          dateAVerifierKey = vendrediKey;
          precedent = mapDates[vendrediKey];
          // debug
          // console.log(`[DEBUG] lundi ${dateCourante} -> compare avec vendredi ${vendrediKey}`);
        }
      }

      // --- Sinon : logique normale -> vérifier le "précédent" dans le tableau trié (datesTriees[i-1]) ---
      if (!dateAVerifierKey) {
        const datePrecedenteKey = datesTriees[i - 1];
        if (
          datePrecedenteKey &&
          courant.report &&
          mapDates[datePrecedenteKey] &&
          mapDates[datePrecedenteKey].solde &&
          Number.isFinite(courant.report.montant) &&
          Number.isFinite(mapDates[datePrecedenteKey].solde.montant)
        ) {
          dateAVerifierKey = datePrecedenteKey;
          precedent = mapDates[datePrecedenteKey];
          // debug
          // console.log(`[DEBUG] ${dateCourante} -> compare avec precedent liste ${dateAVerifierKey}`);
        }
      }

      // Si aucune date valide trouvée => on garde vert
      if (!dateAVerifierKey || !precedent) {
        statusMap[dateCourante] = status;
        continue;
      }

      // Vérification de la distance en jours entre currentDateObj et dateAVerifierKey
      const [yP, mP, dP] = dateAVerifierKey.split("-").map(Number);
      const prevDateObj = new Date(yP, mP - 1, dP);
      const diffMs = currentDateObj.getTime() - prevDateObj.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)); // arrondi pour éviter soucis DST

      const isNormalConsecutive = diffDays === 1; // J-1
      const isWeekendCase = diffDays === 3 && dayOfWeek === 1; // lundi ↔ vendredi

      // On n'analyse que si c'est un cas attendu (consecutif normal ou vendredi->lundi)
      if (isNormalConsecutive || isWeekendCase) {
        const montantReport = courant.report?.montant;
        const montantSoldePrev = precedent?.solde?.montant;

        if (montantReport !== montantSoldePrev) {
          status = "alerte";
          anomaliesTemp.push({
            date: dateCourante,
            description: `L'encaisse fin du ${dateAVerifierKey} (${Number(
              montantSoldePrev
            ).toLocaleString("fr-FR")}) ne correspond pas au report du ${dateCourante} (${Number(
              montantReport
            ).toLocaleString("fr-FR")}) dans le fichier "${courant.report?.fichier}"`,
            fichier: [courant.report?.fichier].filter(Boolean),
            analyse: "report_sje",
          });
        }
      } else {
        // Si on n'a pas un cas attendu (p.ex. date non-consécutive hors weekend), on laisse vert
        // debug possible:
        // console.log(`[DEBUG] ${dateCourante} vs ${dateAVerifierKey} diffDays=${diffDays} => pas comparé`);
      }

      statusMap[dateCourante] = status;
    }

    return { statusMap, anomaliesTemp };
  }, [data]);

  // --- Mettre à jour anomalies dans le parent ---
  useEffect(() => {
    if (setAnomalies) {
      setAnomalies(anomaliesTemp);
      // console.log("anomalies envoyées au parent :", anomaliesTemp);
    }
  }, [anomaliesTemp, setAnomalies]);

  // --- Tableau des 12 mois ---
  const months = useMemo(() => Array.from({ length: 12 }).map((_, i) => i), []);

  // --- Préparer les events pour react-big-calendar ---
  const events = useMemo(() => {
    return Object.keys(statusMap).map((dateStr) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return {
        start: dateObj,
        end: dateObj,
        title: "",
        type: statusMap[dateStr],
      };
    });
  }, [statusMap]);

  function eventsForMonth(monthIndex) {
    return events.filter((ev) => {
      const s = ev.start;
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59);
      return s >= monthStart && s <= monthEnd;
    });
  }

  // Cacher les events (on ne montre que les couleurs)
  function eventPropGetter(event) {
    return { style: { display: "none" } };
  }

  // Coloration des jours
  function dayPropGetter(date) {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
    const status = statusMap[key];
    if (!status) return {}; // aucun style

    return {
      style:
        status === "conge"
          ? { backgroundColor: "yellowgreen" }
          : { backgroundColor: "orange" },
    };
  }

  const [poste_comptable, setPosteComptable] = useState("");

  return (
    <div className="calendar-year-container">
      <div className="months-grid">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {months.map((m) => (
            <section key={m} className="w-55 month-card">
              <div className="month-title">
                {new Date(year, m, 1).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <Calendar
                localizer={localizer}
                events={eventsForMonth(m)}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={["month"]}
                toolbar={false}
                popup={false}
                eventPropGetter={eventPropGetter}
                dayPropGetter={dayPropGetter}
                style={{ height: 200, backgroundColor: "white" }}
                date={new Date(year, m, 1)}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
