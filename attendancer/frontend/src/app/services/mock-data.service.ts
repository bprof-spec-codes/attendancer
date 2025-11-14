import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  constructor() {}

  // Egy esemény adatainak lekérdezése az id-je alapján.
  // A mock-ban már a id alapján visszaadott értéket szimulálja.
  // GET /api/Event/{eventid}
  getEventById(eventId: string): Observable<any> {
    let mockData: any = {}

    if (eventId === "1") {
      mockData =
      {
        "id": "elsodevopslaborid",
        "name": "1. DevOps labor",
        "date": "2025-11-14T01:10",
        "eventGroupId": "devopseventgroupid",
        "metadata": [
          "Neptun code",
          "Seat"
        ]
      };
    }
    else if (eventId === "2") {
      mockData =
      {
        "id": "masodikangularlaborid",
        "name": "2. Angular labor",
        "date": "2025-11-13T02:20",
        "eventGroupId": "angulareventgroupid",
        "metadata": [
          "Neptun code"
        ]
      };
    }
    else {
      mockData =
      {
        "id": "harmadikmobillaborid",
        "name": "3. Mobil labor",
        "date": "2025-11-12T03:30",
        "eventGroupId": "mobileventgroupid",
        "metadata": []
      };
    }

    return of(mockData);
  }

  // Egy esemény résztvevőinek lekérdezése.
  // A mock-ban már az esemény id alapján visszaadott résztvevők adatait szimulálja.
  // GET /api/Participant/{eventid}
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

  // Egy jelenleg bejelentkezett felhasználó által készített esemény csoportok neveinek és metaadatának lekérdezése.
  // A mock-ban a bejelentkezett felhasználó az id-je alapján a saját maga készített esemény csoportok neveit és metaadatait kapja vissza.
  // GET - /api/EventGroup/{userid}
  getEventGroupsWithMetadataByUserId(userId: string): Observable<any> {
    let mockData: any[] = []

    if (userId === "1") {
      mockData = [
        {
          "id": "angulareventgroupid",
          "name": "Angular",
          "metadata": [
            "Neptun code",
            "Email",
            "Phone number"
          ]
        },
        {
          "id": "mobileventgroupid",
          "name": "Mobil Prog",
          "metadata": [
            "Neptun code",
            "Seat"
          ]
        },
        {
          "id": "devopseventgroupid",
          "name": "DevOps",
          "metadata": [
            "Neptun code",
            "Email"
          ]
        }
      ]
    }
    else if (userId === "2") {
      mockData = [
        {
          "id": "d8fgzd",
          "name": ".NET",
          "metadata": [
            "Neptun code",
            "Email",
            "Phone number"
          ]
        },
        {
          "id": "ghferf43u8u7",
          "name": "Beágyazott rendszerek",
          "metadata": [
            "Neptun code",
            "Seat"
          ]
        },
        {
          "id": "asgf43jhed",
          "name": "Rendszerelmélet",
          "metadata": [
            "Neptun code",
            "Email"
          ]
        },
        {
          "id": "angulareventgroupid",
          "name": "Angular",
          "metadata": [
            "Neptun code",
            "Email",
            "Phone number"
          ]
        },
        {
          "id": "mobileventgroupid",
          "name": "Mobil Prog",
          "metadata": [
            "Neptun code",
            "Seat"
          ]
        },
        {
          "id": "devopseventgroupid",
          "name": "DevOps",
          "metadata": [
            "Neptun code",
            "Email"
          ]
        }
      ]
    }
    else {
      mockData = [
        {
          "id": "rfgsdfdrt542gd2",
          "name": "DIMAT",
          "metadata": [
            "Neptun code",
            "Email",
            "Phone number"
          ]
        },
        {
          "id": "asfd54vd34",
          "name": "Analízis",
          "metadata": [
            "Neptun code",
            "Seat"
          ]
        },
        {
          "id": "xcv52jhsad34fd",
          "name": "Hálózatok",
          "metadata": [
            "Neptun code",
            "Email"
          ]
        },
        {
          "id": "angulareventgroupid",
          "name": "Angular",
          "metadata": [
            "Neptun code",
            "Email",
            "Phone number"
          ]
        },
        {
          "id": "mobileventgroupid",
          "name": "Mobil Prog",
          "metadata": [
            "Neptun code",
            "Seat"
          ]
        },
        {
          "id": "devopseventgroupid",
          "name": "DevOps",
          "metadata": [
            "Neptun code",
            "Email"
          ]
        }
      ]
    }

    return of(mockData)
  }

  // Egy jelenleg bejelentkezett felhasználó által készített események lekérdezése.
  // A mock-ban a bejelentkezett felhasználó az id-je alapján a saját maga készített eseményeket kapja vissza.
  // GET - /api/Event/{userid}
  getEventsByUserId(userId: string): Observable<any> {
    let mockData: any[] = []

    if (userId === "1") {
      mockData = [
        {
          "id": "gsdaafr3eqw",
          "name": "Űrhajós előadás",
          "eventGroupId": "",
          "metadata": [
            "Neptun code",
            "Email",
            "Phone number"
          ]
        },
        {
          "id": "scadv43dnes543dv",
          "name": "XYZ Megbeszélés",
          "eventGroupId": "",
          "metadata": [
            "Seat",
            "Email"
          ]
        }
      ]
    }
    else if (userId === "2") {
      mockData = [
        {
          "id": "fsd4535fdgs54wdsa",
          "name": "ZYX Megbeszélés",
          "eventGroupId": "",
          "metadata": [
            "Seat",
            "Phone number",
            "Email"
          ]
        }
      ]
    }
    else {
      mockData = mockData = [
        {
          "id": "asrtevdf3w456zthfdds",
          "name": "Egyszeri esemény",
          "eventGroupId": "",
          "metadata": [
            "Seat"
          ]
        }
      ]
    }

    return of(mockData)
  }

  // Egy új esemény hozzáadása.
  // POST - /api/Event
  postEvent(event: any) {
    console.log("(POST - /api/Event) The following data will be sent to the backend:")
    console.log(event)
  }

  // Egy esemény frissítése.
  // PUT - /api/Event/{eventid}
  updateEvent(event: any) {
    console.log("(PUT - /api/Event/{eventid}) The following data will be sent to the backend:")
    console.log("eventid: " + event.id)
    console.log(event)
  }

  // Egy esemény törlése az id-je alapján.
  // DELETE - /api/Event/{eventid}
  deleteEvent(eventId: string) {
    console.log("(DELETE - /api/Event/{eventid}) The following data will be sent to the backend:")
    console.log(eventId)
  }
}
