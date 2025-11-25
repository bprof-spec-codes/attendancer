import { ParticipantsViewDto } from "./participants-view-dto"

export class EventViewDto {
    id: string = ""
    name: string = ""
    date: Date = new Date()
    qrCode: any = null
    isQrValid: boolean = false
    metadata: string[] = []
    eventGroupName: string = ""
    participants: ParticipantsViewDto[] = []
}
