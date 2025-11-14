export class EventModel {
    
   id: string
   name : string
   qrCodeValue : string
   isQrvalid: boolean
   expirationDate: Date
   metadata: string[]
   userId: string
   eventGroupId: string

   constructor(id: string, name : string, qrCodeValue : string, isQrvalid: boolean, expirationDate: Date, metadata: string[], userId: string, eventGroupId: string){
    this.id = id
    this.name = name
    this.qrCodeValue = qrCodeValue
    this.isQrvalid = isQrvalid
    this.expirationDate = expirationDate
    this.metadata = metadata
    this.userId = userId
    this.eventGroupId = eventGroupId
   }

}
