# Attendancer
- [Task Description](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/attendancer.md)
- [CoC](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/coc.md)
- [Requirements](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/requirements.md)

## Team
| Name | Role | GitHub Profile |
|------|------|----------------|
| Ádám Révész | Manager | [AdamRevesz](https://github.com/AdamRevesz) |
| Tamás Schäffer | Architect | [SefiTamas](https://github.com/SefiTamas) |
| Bendegúz Tonuzóba Nagy | Frontend Developer | [NagyBendeguz](http://github.com/NagyBendeguz) |
| Roland Orcsik  | Frontend Developer | [OrcsikRoland](http://github.com/OrcsikRoland) |
| Özséb Kelemen | Backend Developer | [KelemenOzseb](http://github.com/KelemenOzseb) |
| Dániel Rezsnyák | Backend Developer | [rezsnyakdani](http://github.com/rezsnyakdani) |
| Benedek Zoltán Szabó | Backend Developer | [szabo-benedek](http://github.com/szabo-benedek) |
| Kánya Marcell | Frontend Developer | [Marci260](https://github.com/Marci260) |

Használt technológiák:
- Frontend: Angular
- Backend: ASP.NET

## Developer Guide
- Node.js + npm
- Angular CLI
- Visual Studio (ASP.NET Core)
- SQL database (LocalDB/MSSQL)
- .NET EF Tools

## Frontend (Angular)

```
cd Frontend/Attendancer
npm install
ng serve
```

Runs at `http://localhost:4200/`

## Backend (ASP.NET Core)

1. Open the solution in Visual Studio
2. Add Migration (if needed)
```
Add-Migration
```

3. Update database
```
Update-Database
```

4. Run the application
5. Swagger UI is available during runtime

---

## Develop Default Accounts

| Email | Password |
|-------|----------|
| janos.kovacs@example.com | JanosKovacs123 |
| peter.toth@example.com | PeterToth123 |
| anna.nagy@example.com | AnnaNagy123 |

## Use-cases

### Users

- Create attendance sheets
- Create groups out of attendance sheets
- Sign attendance sheets
- Edit or delete their sheets
- See a table for each of their attendance sheet groups, that include all users that signed on the sheets in said group
- See sheets they signed
- Edit user information

---

## API function list

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/User/register` | POST | User registration |
| `/api/User/login` | POST | User login | 
| `/api/User/{id}` | GET | Read user |
| `/api/User` | GET | Read all users |
| `/api/User` | DELETE | Deactivate user |
| `/name` | PUT | Update user's name |
| `/email` | PUT | Update user's email | 
| `/password` | PUT | Update user's password |
| `/api/User/me` | GET | Read logged in user |
| `/api/User/me/signed-sheets` | GET | Read sheets signed by user |
| `/api/Event` | POST | Create Event |
| `/api/Event` | GET | Read all events |
| `/api/Event/{eventId}` | GET | Read event |
| `/api/Event/{eventId}` | PUT | Update event |
| `/api/Event/{eventId}` | DELETE | Delete event |
| `/api/GetEventByUserId` | GET | Read all of user's events |
| `/api/Event/{eventId}/generate-qr` | POST | Create QR code for event |
| `api/Event/{eventId}/qr` | GET | Read event's qr code |
| `/api/Event/{eventId}/invalidate` | PUT | Invalidate event |
| `/api/Event/{eventId}/validate` | PUT | Validate event|
| `/api/EventGroup` | POST | Create event group |
| `/api/EventGroup` | GET | Read all event groups | 
| `/api/EventGroup/ByUserId` | GET | Read event groups of user |
| `/api/EventGroup/{eventGroupId}` | PUT | Update event group |
| `/api/EventGroup/{eventGroupId}` | DELETE | Delete event group |
| `/api/EventGroup/{eventGroupId}` | GET | Read event group |
| `/api/EventGroup/{eventGroupId}/{userId}` | GET | Read event group of user |
| `/api/EventGroup/{eventGroupId}/matrix` | GET | Give back an event group's attendance stats |
| `/api/Participant/{eventId}` | POST | Add user to event |
| `/api/participant` | GET | Read all participants | 

---
## Frontend Components

| Screen | Purpose |
|--------|---------|
| Login/Register | User authentication |
| Profile | Control panel and displaying events the user signed up to |
| Sheet | Display data from the event | 
| Create sheet | Form to create or update events | 
| Statistics | Display the event group attendance stats in a matrix-like view |
| Sheets | Display your created events and event groups/modify them |
| Form | Users sign up on this form to events | 

### Login/Register
<img width="1395" height="1001" alt="Register" src="https://github.com/user-attachments/assets/ad3c7e68-e834-42a1-a561-92f8b5350e65" />

### Profile
<img width="2560" height="1440" alt="Profile" src="https://github.com/user-attachments/assets/28c66e06-a0c0-44ba-a115-4ce955de7c48" />

## Sheet
<img width="2560" height="1440" alt="sheetview" src="https://github.com/user-attachments/assets/ddaf9492-41f9-44e0-9510-9ff70bae779a" />

## Create Sheet
<img width="1351" height="701" alt="create" src="https://github.com/user-attachments/assets/e70f49ef-84ae-4c73-bdb4-b9ff4d18e1d0" />

## Sheets
<img width="2560" height="1440" alt="sheets" src="https://github.com/user-attachments/assets/f67b598b-0c4b-404f-8927-1cb03348e2df" />

## Statistics
<img width="2560" height="1080" alt="Matrix" src="https://github.com/user-attachments/assets/4998590c-2b4c-477d-b736-52ec116a344c" />

---

## Issues throughout development

| Problem | Area | Rsolution | 
|---------|------|-----------|

## Documentation
`/Docs` folder in the repository includes:
- `UserManual.pdf` 
