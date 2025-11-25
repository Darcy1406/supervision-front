import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendrier.css';

const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Format local "YYYY-MM-DD"
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Calendrier({ evenements = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  // Transforme les événements en Date locale
  const events = useMemo(() => {
    if (!Array.isArray(evenements)) return [];
    return evenements.map((item) => {
      const [year, month, day] = item.fields.date_evenement.split('-');
      const [hours = '0', minutes = '0'] = (item.fields.heure_evenement || '0:0').split(':');

      const start_event = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes)
      );

      return {
        title: item.fields.description || '',
        start: start_event,
        end: start_event,
      };
    });
  }, [evenements]);

  // Dates ayant des événements
  const eventDatesSet = useMemo(() => {
    const set = new Set();
    events.forEach((e) => {
      set.add(formatLocalDate(e.start));
    });
    return set;
  }, [events]);

  // Colorier seulement les jours en month view
  const dayPropGetter = (date) => {
    if (currentView !== 'month') return {};

    const key = formatLocalDate(date);
    if (eventDatesSet.has(key)) {
      return {
        style: {
          backgroundColor: '#cce5ff',
        },
      };
    }
    return {};
  };

  // Cacher les événements uniquement en month view
  const eventPropGetter = () => {
    if (currentView === 'month') {
      return { style: { display: 'none' } };
    }
    return {}; // en agenda / week / day → afficher normalement
  };

  return (
    <div id="calendrier" className="w-70 h-65 mx-auto">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="fr"
        messages={{
          today: "Aujourd'hui",
          previous: 'Précédent',
          next: 'Suivant',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Heure',
          event: 'Événement',
          noEventsInRange: 'Aucun événement dans cette période.',
        }}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        style={{ width: '100%' }}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
}
