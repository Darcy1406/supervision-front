import React, { useMemo, useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendrierAnnuel.css";

const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendrierAnnuel({ data = [], setYear, year, setAnomalies }) {

  // --- Analyse et transformation des données ---
  const { statusMap, anomaliesTemp } = useMemo(() => {
    if (!data || data.length === 0) return { statusMap: {}, anomaliesTemp: [] };

    const mapDates = {};
    data.forEach((item) => {
      const parts = item.document__nom_fichier.split(",");
      const dateString = parts[parts.length - 1].trim();
      if (!mapDates[dateString]) mapDates[dateString] = {};
      mapDates[dateString][item.nature] = {
        montant: item.montant,
        fichier: item.document__nom_fichier
      };
    });

    const datesTriees = Object.keys(mapDates).sort();
    const statusMap = {};
    const anomaliesTemp = [];

    for (let i = 0; i < datesTriees.length; i++) {
      const dateCourante = datesTriees[i];
      const datePrecedente = datesTriees[i - 1];
      const courant = mapDates[dateCourante];
      const precedent = mapDates[datePrecedente] || {};

      let status = "conge"; // vert par défaut

      if (
        datePrecedente &&
        courant.report !== undefined &&
        precedent.solde !== undefined
      ) {
        if (courant.report.montant !== precedent.solde.montant) {
          status = "alerte"; // orange
          anomaliesTemp.push({
            date: dateCourante,
            description: `L'encaisse fin de journée du ${datePrecedente} (${precedent.solde.montant.toLocaleString('fr-FR')}) ne correspond pas au report de la journée du ${dateCourante} (${courant.report.montant.toLocaleString('fr-FR')}) dans le fichier "${courant.report.fichier}"`,
            fichier: courant.report.fichier
          });
          // anomaliesTemp.push({
          //   date: dateCourante,
          //   description: `L'encaisse fin de journée du ${datePrecedente} (${precedent.solde.montant.toLocaleString('fr-FR')}) ne correspond pas au report de la journée du ${dateCourante} (${courant.report.montant.toLocaleString('fr-FR')}) dans le fichier "${courant.report.fichier}"`,
          //   montant_report: courant.report.montant,
          //   montant_solde_precedent: precedent.solde.montant,
          //   fichier: courant.report.fichier
          // });
        }
      }

      statusMap[dateCourante] = status;
    }

    return { statusMap, anomaliesTemp };
  }, [data]);

  // --- Mettre à jour le state parent avec les anomalies ---
  useEffect(() => {
    if (setAnomalies) {
      setAnomalies(anomaliesTemp);
    }
  }, [anomaliesTemp, setAnomalies]);

  // --- Tableau des 12 mois ---
  const months = useMemo(() => Array.from({ length: 12 }).map((_, i) => i), []);

  // --- Préparer events pour react-big-calendar ---
  const events = useMemo(() => {
    return Object.keys(statusMap).map((dateStr) => ({
      start: new Date(dateStr),
      end: new Date(dateStr),
      title: "", // texte masqué
      type: statusMap[dateStr]
    }));
  }, [statusMap]);

  function eventsForMonth(monthIndex) {
    return events.filter((ev) => {
      const s = new Date(ev.start);
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59);
      return s >= monthStart && s <= monthEnd;
    });
  }

  function eventPropGetter(event) {
    return { style: { display: "none" } };
  }

  function dayPropGetter(date) {
    const key = date.toISOString().split("T")[0];
    const status = statusMap[key];
    let style = {};

    if (status === "conge") style = { backgroundColor: "yellowgreen" };
    else if (status === "alerte") style = { backgroundColor: "orange" };

    return { style };
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






