import { ParticipantsViewDto } from "./participants-view-dto"

export class EventViewDto {
    id: string = ""
    name: string = ""
    date: string = ""
    userId: string = ""
    qrCode: any = null
    isQrValid: boolean = false
    metadata: string[] = []
    eventGroupName: string = ""
    eventGroupId: string = ""
    participants: ParticipantsViewDto[] = []
}
