import React, { createElement, useState } from 'react';
import {DateTime} from 'luxon';
import EventArles from './events-arles.json';
import './Agenda.css';

const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const joursSemaine  = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
let years = DateTime.local().year;

function evenementsPourDate(date, events) {
    return events.filter((event) => {
      for (const dateEvent of event.timings) {
        if (dateEvent.start.slice(0, 10) === date) {
            return event;
        }
    }
    });
}

function PopupDetail({ event, onClose }) {    
    let condition = event.conditions ? event.conditions.fr : "Pas de conditions";
    return (
      <div className="popupDetail">
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

function Popup({ date, evenements, onClose }) {
    const [popupDetail, setPopupDetail] = useState(null);

    if (evenements.length > 0) {
        return (
            <div className="popup">
                <div className="popup_header">
                    <button onClick={onClose}>X</button>
                    <h2>Evenements du {DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)}</h2>
                </div>

                <div className="popup_master_detail">
                    <ul>
                        {evenements.map((event) => (
                            <li key={event.id} onClick={() => {setPopupDetail(<PopupDetail event={event} onClose={() => setPopupDetail(null)}/>);}}>
                                {event.title.fr}
                            </li>)
                        )}
                    </ul>

                    {popupDetail}
                </div>
            </div>
        );
    }

    else{
        alert("Pas d'événement pour cette date");
    }

}

function Case({value, date, events}) {
    let evenements = evenementsPourDate(date, events);
    let nbEvenements = evenements.length;
    return (
        <div className="case">
            <div className="chiffre">{value}</div>
            <div className="evenements">{nbEvenements}</div>
        </div>
    );
}
        
function TableauAgenda({value, years}) {
    let jourSemaine = DateTime.local(years, mois.indexOf(value) + 1, 1).weekday;
    let nombreJoursMois = DateTime.local(years, mois.indexOf(value) + 1, 1).daysInMonth;

    let nbJour = 1;
    let table = [];

    const [popup, setPopup] = useState(null);

    function handleCaseClick(date) {
        let evenements = evenementsPourDate(date, EventArles.events);
        setPopup(
            <Popup
                date={date}
                evenements={evenements}
                onClose={() => setPopup(null)}
            />
        );
        
    }

    for (let i = 0; i < 6; i++) {
        let children = [];
        for (let j = 0; j < 7; j++) {
            if (nbJour <= nombreJoursMois && (i > 0 || j >= jourSemaine - 1)) {
                let chiffre = nbJour;
                let date_jour = DateTime.local(years, mois.indexOf(value) + 1, chiffre).toISODate();
                const classe = (DateTime.local().toISODate() === date_jour) ? "aujourdhui" : "jour";

                    children.push(
                        <td key={j} className={classe} onClick={() => handleCaseClick(date_jour)}>
                            <Case value={chiffre} date={date_jour} events={EventArles.events}/>
                        </td>
                    );
                    
                nbJour++;

            } 
            
            else {
                children.push(<td key={j} className="jour"></td>);
            }
            
        }
        table.push(<tr key={i}>{children}</tr>);
    }

    return (
        <>
            <table className='tableau'>
                <thead>
                    <tr>
                        {joursSemaine.map((jour) => (
                            <th key={jour}>{jour}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{table}</tbody>
            </table>

            <div>
                {popup}
            </div>
        </>
    );
}

function Date({value, years}) { 
    return (
        <div className="date">
            <div className="mois">
                <Mois value={value}/>
            </div>

            <div className="espace"></div>

            <div className="annee">
                <Annee value={years}/>
            </div>
        </div>
    );
}

function Mois({value}) {
    return (
        <h2 className="mois">{value}</h2>
    );
}

function Annee({value}) {
    return (
        <h2 className="annee">{value}</h2>
    );
}

function ChangerMois({value, onMoisClick}) {
    return (
        <button className="changer_mois" onClick={onMoisClick} alt="changer de mois">{value}</button>
    );
}

function ChangerAnnee({value, onAnneeClick}) {
    return (
        <button className="cannee" onClick={onAnneeClick} alt="changer d'année">{value}</button>
    );
}

export default function Agenda() {
    const [i, setI] = useState(DateTime.local().month - 1);

    const [years, setYears] = useState(DateTime.local().year);
    

    function handleClick(i) {
        if (i < 0) {
            setI(11);
            setYears(years - 1);
        }
        else if (i > 11) {
            setI(0);
            setYears(years + 1);
        }
        else {
            setI(i);
        }

    }


    


    return (
                <div className="agenda">
                    <div className="agenda-header">
                        <h1>Agenda Evenements Arles</h1>
                    </div>

                    <div className="agenda-date">
                        <ChangerMois value={"<"} onMoisClick={() => handleClick(i-1)}/>

                        <div className="changer_annee">
                            <ChangerAnnee value={"-"} onAnneeClick={() => setYears(years - 1)}/>
                            <Date value={mois[i]} years={years}/>
                            <ChangerAnnee value={"+"} onAnneeClick={() => setYears(years + 1)}/>
                        </div>
                        <ChangerMois value={">"} onMoisClick={() => handleClick(i+1)}/>
                    </div>

                    <div className="agenda-body">
                        <div>
                            <TableauAgenda value={mois[i]} years={years}/>
                        </div>
                    </div>
                </div>
            );
}