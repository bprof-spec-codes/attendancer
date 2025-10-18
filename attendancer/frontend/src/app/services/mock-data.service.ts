import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  constructor() {}

  // Egy esemény adatainak lekérdezése az id-je alapján.
  // A mock-ban már a id alapján visszaadott értéket szimulálja.
  // /api/Event/{id}
  // A metadata formázása hol történjen? ???
  getEventById(): Observable<any> {
    const mockData =
    {
      "name": "1. DevOps labor",
      "eventGroupId": "asdfghjkl",
      "metadata": [
        "Neptun code",
        "Seat"
      ]
    };
    return of(mockData);
  }

  // Egy esemény résztvevőinek lekérdezése.
  // A mock-ban már az esemény id alapján visszaadott résztvevők adatait szimulálja.
  // /api/Participant/{eventid}
  // userId < userName ???
  // date < present ???
  getParticipantsByEventId(): Observable<any> {
    const mockData =
    [
      {
        "userName": "Gipsz Jakab",
        "present": true,
        "metadata": [
            "JMAH67",
            3
        ]
      },
      {
        "userName": "Béla",
        "present": true,
        "metadata": [
            "KLX523",
            5
        ]
      },
      {
        "userName": "Pista",
        "present": false,
        "metadata": [
            "IUSR67",
            0
        ]
      },
      {
        "userName": "Bence",
        "present": true,
        "metadata": [
            "ITS439",
            6
        ]
      },
      {
        "userName": "Kati",
        "date": false,
        "metadata": [
            "STRDO5",
            0
        ]
      }
    ];
    return of(mockData);
  }
}
