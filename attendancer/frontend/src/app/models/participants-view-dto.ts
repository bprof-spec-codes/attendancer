export class ParticipantsViewDto {
    userFullName: string = ""
    present: boolean = false
    date: Date = new Date()
    metadata: string[] = []
    metadataDictionary: any = {}
}
