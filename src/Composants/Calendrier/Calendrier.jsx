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


export default function Calendrier({evenements = []}) {
  
  let events = [];
  
  if(evenements){

    evenements.forEach(item => {
      const dateTimeStr = `${item.fields.date_evenement} ${item.fields.heure_evenement}`; 
      const start_event = new Date(dateTimeStr); 
      const end_event = new Date(start_event.getTime() + 0 * 60 * 60 * 1000); 
      events.push({
        title: item.fields.description,
        start: start_event,
        end: end_event,
      })
    })
    
  }


  return (
    <div id='calendrier' className='w-70 h-54 mx-auto'>
        <Calendar 
            localizer={localizer}
            events={events}
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