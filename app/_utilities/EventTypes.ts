type Event = {
  title: string;
  summary: string;
  link: string;
}

export type EventResponse = {
  from: string;
  events: Event[]
}

export interface NYCTimeoutResponse extends EventResponse {
  from: "Timeout"
}