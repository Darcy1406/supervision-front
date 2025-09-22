import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import {format} from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import { fr } from 'date-fns/locale/fr'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Calendrier.css';


const locales = {
    'fr': fr,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

export default function Calendrier() {
  return (
    <div id='calendrier' className='h-65'>
        <Calendar 
            localizer={localizer}
            startAccessor='start'
            endAccessor="end"
            style={{width: "100%", height: "100%"}}
            culture="fr"
            messages={{
                today: "Aujourd'hui",
                previous: "Précédent",
                next: "Suivant",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                agenda: "Agenda",
                date: "Date",
                time: "Heure",
                event: "Événement",
                noEventsInRange: "Aucun événement dans cette période.",
            }}
        />
    </div>
  )
}