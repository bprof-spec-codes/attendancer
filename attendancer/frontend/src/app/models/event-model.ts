export class EventModel {
    id: string = ""
    name: string = ""
    qrCodeValue: string = ""
    isQrValid: boolean = true
    expirationDate: Date = new Date()
    metadata: string[] = []
    userId: string = ""
    eventGroupId: string  = ""
    /*constructor(Id: string, Name: string, QrCodeValue: string | null, IsQrValid: boolean,  ExpirationDate: Date, Metadata: string[] | null, UserId: string, EventGroupId: string | null)
    {
        this.id = Id
        this.name = Name
        this.qrCodeValue = QrCodeValue
        this.isQrValid = IsQrValid
        this.expirationDate = ExpirationDate
        this.metadata = Metadata
        this.userId = UserId
        this.eventGroupId = EventGroupId
    }*/
}
