import React, { createElement, useState } from 'react';
import {DateTime} from 'luxon';
import EventArles from './events-arles.json';
import './Planning.css';

function Date({date, onChange}) {
    return (
        <div className="date-event">
            <input type="date" value={date} onChange={onChange}/>
        </div>
    );
}

function Tags({events, onChange}) {
    let tags = [];
    for (let i = 0; i < events.length; i++) {
        for (let j = 0; j < events[i].tags.length; j++) {
            tags.push(events[i].tags[j].label);
        }
    }

    tags = [...new Set(tags)];

    tags.sort(function(a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });


    return (
        <div className="tags">
            <select onChange={onChange}>
                <option value="tous">Tous</option>
                {tags.map((tag) => <option value={tag}>{tag}</option>)}
            </select>
        </div>

    );
}

function Evenement({events, tags, date}) {
    const [popupDetail, setPopupDetail] = useState(null);
    let evenements = [];
    for (let i = 0; i < events.length; i++) {
        for (let j = 0; j < events[i].timings.length; j++) {
            if (events[i].timings[j].start.slice(0, 10) === date) {
                if (tags === "tous") {
                    evenements.push(events[i]);
                } else {
                    for (let k = 0; k < events[i].tags.length; k++) {
                        if (events[i].tags[k].label === tags) {
                            evenements.push(events[i]);
                        }
                    }
                }
            }
        }
    }

    evenements = [...new Set(evenements)];

    evenements.sort(function(a, b) {
        if (a.timings[0].start.slice(11, 16) < b.timings[0].start.slice(11, 16)) {
            return -1;
        }
        if (a.timings[0].start.slice(11, 16) > b.timings[0].start.slice(11, 16)) {
            return 1;
        }
        return 0;
    });

    if(evenements.length > 0) {
        return (
            <div className="event-master-detail">
                <ul>
                {evenements.map((event) => <li key={event.id} onClick={() => {setPopupDetail(<PopupDetail event={event} onClose={() => setPopupDetail(null)}/>);}}>
                            <p>{event.timings[0].start.slice(11, 16)}h - {event.timings[0].end.slice(11, 16)}h</p>
                            <h3>{event.title.fr}</h3>
                        </li>
                    )}
                </ul>
                {popupDetail}
            </div>
        );

    } else {
        return (
            <div className="no-event">
                <h1>Aucun evenement</h1>
            </div>
        );
    }
}

function PopupDetail({event, onClose}) {
    let condition = event.conditions ? event.conditions.fr : "Pas de conditions";
    return (
      <div className="eventDetail">
        <h2>{event.title.fr}</h2>
        <img src={event.image} alt="image evenement" />
        <p>{"Description : " + event.description.fr}</p>
        <p>{"Lieu : " + event.address}</p>
        <p>{"Horraire : " + event.timings[0].start.slice(11, 16) + "h"} - {event.timings[0].end.slice(11, 16) + "h"}</p>
        <p>{"Condition : " +  condition}</p>
        <button onClick={onClose}>Retour</button>
      </div>
    );
}

export default function Planning() {
    const [tags, setTags] = useState("tous");
    const [date, setDate] = useState(DateTime.local().toISODate());
    
    function changeDate(event) {
        setDate(event.target.value);
    }

    function changeTags(event) {
        setTags(event.target.value);
    }

    return ( 
        <div className="planning">
            <div className="planning-header">
                <h1>Planning Evenements Arles</h1>
            </div>
            
            <div className="planning-body">
                <div className='planning-filter'>
                    <Date date={date} onChange={changeDate }/> 
                    <Tags events={EventArles.events} onChange={changeTags}/>
                </div>
                

                <>
                    <Evenement events={EventArles.events} tags={tags} date={date}/>
                </>
            </div>
        </div>
    );
}
