import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import AddEventModal from './AddEventModal'
import axios from 'axios'
import moment from 'moment'

export default function () {
    const [modalOpen, setModalOpen] = useState(false)
    const [events, setEvents] = useState([])
    const calendarRef = useRef(null)
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }

    const onEventAdded = (event) => {
        let calendarApi = calendarRef.current.getApi()
        calendarApi.addEvent({
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            title: event.title
        })
    }

    async function handleEventAdd(data) {
        await axios.post('/api/calendar/create-event', data.event, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        })
    }

    async function handleDateSet(data) {
        const response = await axios.get('/api/calendar/get-events?start=' + moment(data.start).toISOString() + '&end=' + moment(data.end).toISOString(), {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        })
        setEvents(response.data)
    }

    return (
        <section>
            <button
                onClick={() => setModalOpen(true)}
                className="btn"
            >
                Add event
            </button>

            <a
                href='/'
                onClick={logoutHandler}
                className="btn red darken-4"
            >
                Logout
            </a>

            <div style={{ position: 'relative', zIndex: 0 }}>
                <FullCalendar
                    ref={calendarRef}
                    events={events}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    eventAdd={(event) => handleEventAdd(event)}
                    datesSet={(date) => handleDateSet(date)}
                />
            </div>

            <AddEventModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onEventAdded={(event) => onEventAdded(event)}
            />
        </section >
    )
}