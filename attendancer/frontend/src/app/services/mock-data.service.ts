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
          "id": "sdfga32sfd",
          "name": "Angular",
          "metadata": [
            "Neptun code",
            "Email",
            "Phone number"
          ]
        },
        {
          "id": "sdgfsd2qq",
          "name": "Mobil Prog",
          "metadata": [
            "Neptun code",
            "Seat"
          ]
        },
        {
          "id": "jmhhgf34",
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

  // Egy esemény törlése az id-je alapján.
  // DELETE - /api/Event/{eventid}
  deleteEvent(eventId: string) {
    console.log("(DELETE - /api/Event/{eventid}) The following data will be sent to the backend:")
    console.log(eventId)
  }

  // Egy felhasználó adatainak lekérése az felhasználó id-je alapján.
  // A mock-ban a bejelentkezett felhasználó az id-je alapján a saját maga adatait kapja vissza (kivéve a jelszót).
  // GET - /api/User/{userid}
  getUserByUserId(userId: string): Observable<any> {
    let mockData: any = {}

    if (userId === "1") {
      mockData = {
        "lastName": "Kovács",
        "firstName": "János",
        "email": "janos.kovacs@example.com"
      }
    }
    else if (userId === "2") {
      mockData = {
        "lastName": "Tóth",
        "firstName": "Péter",
        "email": "peter.toth@example.com"
      }
    }
    else {
      mockData = {
        "lastName": "Nagy",
        "firstName": "Anna",
        "email": "anna.nagy@example.com"
      }
    }

    return of(mockData)
  }

  // Egy jelenleg bejelentkezett felhasználó az eseményeken való részvételeinek adatait kérdezi le.
  // A mock-ban a bejelentkezett felhasználó az id-je alapján a szükséges események csoportjait 
  // és az azokhoz tartozó események részvételi állapotát kapja vissza.
  // GET - /api/EventGroup/participation/{userid}
  getSignedEventsByUserId(userId: string): Observable<any> {
    let mockData: any[] = []

    if (userId === "1") {
      mockData = [
        {
          "name": "Angular",
          "lastSigned": "2025.10.18.",
          "signedEvents": [
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true
          ]
        },
        {
          "name": "DevOps",
          "lastSigned": "2025.10.10.",
          "signedEvents": [
            true,
            false,
            true,
            true,
            true,
            false,
            true,
            true
          ]
        },
        {
          "name": "Egyszeri esemény",
          "lastSigned": "2025.10.04.",
          "signedEvents": [
            true,
          ]
        }
      ]
    }
    else if (userId === "2") {
      mockData = [
        {
          "name": "Rendszerelmélet",
          "lastSigned": "2025.10.16.",
          "signedEvents": [
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            true
          ]
        },
        {
          "name": "Beágyazott rendszerek",
          "lastSigned": "2025.10.23.",
          "signedEvents": [
            true,
            false,
            false,
            true,
            true,
            false,
            true,
            true
          ]
        },
        {
          "name": "Egyszeri esemény 2.0",
          "lastSigned": "2025.10.04.",
          "signedEvents": [
            true,
          ]
        }
      ]
    }
    else {
      mockData = [
        {
          "name": "DIMAT",
          "lastSigned": "2025.10.21.",
          "signedEvents": [
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            true
          ]
        },
        {
          "name": "Analízis",
          "lastSigned": "2025.10.29.",
          "signedEvents": [
            true,
            false,
            false,
            false,
            true,
            false,
            true,
            true
          ]
        },
        {
          "name": "Egyszeri esemény 3.0",
          "lastSigned": "2025.10.04.",
          "signedEvents": [
            false,
          ]
        }
      ]
    }

    return of(mockData)
  }
}
