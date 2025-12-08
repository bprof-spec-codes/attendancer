import { EventViewDto } from "./event-view-dto"

export class EventGroupViewDto {
    id: string = ""
    name: string = ""
    metadata: string[] = []
    events: EventViewDto[] = []
}
