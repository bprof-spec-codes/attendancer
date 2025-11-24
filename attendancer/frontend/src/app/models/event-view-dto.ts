import { ParticipantsViewDto } from "./participants-view-dto"

export class EventViewDto {
    id: string = ""
    name: string = ""
    qrCode: any = null
    isQrValid: boolean = false
    metadata: string[] = []
    eventGroupName: string = ""
    participants: ParticipantsViewDto[] = []
}
