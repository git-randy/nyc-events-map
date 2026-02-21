type Event = {
  title: string;
  summary: string;
  link: string;
  locations?: string[] | undefined
}

export type EventResponse = {
  from: string;
  events: Event[]
}

export interface NYCTimeoutResponse extends EventResponse {
  from: "TimeOut"
}