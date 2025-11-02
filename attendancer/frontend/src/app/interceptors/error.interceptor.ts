import { Injectable } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http'
import { catchError, Observable, throwError } from 'rxjs'
import { PopupService } from '../popup/popup.service'

const getErrorMsgByStatus = (status: number): string => {
  switch (status) {
    case 0:
      return 'Nem sikerült csatlakozni a szerverhez. Ellenőrizd az internetkapcsolatot.'
    case 401:
      return 'A művelethez be kell jelentkezni.'
    case 403:
      return 'Nincs jogosultságod a művelethez.'
    case 404:
      return 'A kért erőforrás nem található.'
    case 500:
      return 'Szerverhiba történt, próbáld újra később.'
    default:
      return 'Ismeretlen hiba történt.'
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private popup: PopupService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg = getErrorMsgByStatus(error.status)
        this.popup.show(msg, 4000)
        return throwError(() => error)
      })
    )
  }
}