import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  constructor() {}

  // Egy esemény adatainak lekérdezése az id-je alapján.
  // A mock-ban már a id alapján visszaadott értéket szimulálja.
  // /api/Event/{eventid}
  getEventById(eventId: string): Observable<any> {
    let mockData: any = {}
    if (eventId === "1") {
      mockData =
      {
        "name": "1. DevOps labor",
        "eventGroupId": "dasgf",
        "metadata": [
          "Neptun code",
          "Seat"
        ]
      };
    }
    else if (eventId === "2") {
      mockData =
      {
        "name": "2. Angular labor",
        "eventGroupId": "asdfghjkl",
        "metadata": [
          "Neptun code"
        ]
      };
    }
    else {
      mockData =
      {
        "name": "3. Mobil labor",
        "eventGroupId": "bxdt32qgta",
        "metadata": []
      };
    }

    return of(mockData);
  }

  // Egy esemény résztvevőinek lekérdezése.
  // A mock-ban már az esemény id alapján visszaadott résztvevők adatait szimulálja.
  // /api/Participant/{eventid}
  getParticipantsByEventId(eventId: string): Observable<any> {
    let mockData: any[] = []
    if (eventId === "1") {
      mockData = 
      [
        {
          "username": "Gipsz Jakab",
          "present": true,
          "metadata": [
              "JMAH67",
              3
          ]
        },
        {
          "username": "Béla",
          "present": true,
          "metadata": [
              "KLX523",
              5
          ]
        },
        {
          "username": "Pista",
          "present": false,
          "metadata": [
              "IUSR67",
              0
          ]
        },
        {
          "username": "Bence",
          "present": true,
          "metadata": [
              "ITS439",
              6
          ]
        },
        {
          "username": "Kati",
          "date": false,
          "metadata": [
              "STRDO5",
              0
          ]
        }
      ];
    }
    else if (eventId === "2") {
      mockData = 
      [
        {
          "username": "Gipsz Jakab",
          "present": true,
          "metadata": [
              "JMAH67"
          ]
        },
        {
          "username": "Béla",
          "present": true,
          "metadata": [
              "KLX523"
          ]
        },
        {
          "username": "Pista",
          "present": false,
          "metadata": [
              "IUSR67"
          ]
        },
        {
          "username": "Bence",
          "present": true,
          "metadata": [
              "ITS439"
          ]
        },
        {
          "username": "Kati",
          "date": false,
          "metadata": [
              "STRDO5"
          ]
        }
      ];
    }
    else {
      mockData = 
      [
        {
          "username": "Gipsz Jakab",
          "present": true,
          "metadata": []
        },
        {
          "username": "Béla",
          "present": true,
          "metadata": []
        },
        {
          "username": "Pista",
          "present": false,
          "metadata": []
        },
        {
          "username": "Bence",
          "present": true,
          "metadata": []
        },
        {
          "username": "Kati",
          "date": false,
          "metadata": []
        }
      ];
    }

    return of(mockData);
  }
}
