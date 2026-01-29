export type EventResponse = {
  from: string;
  events: {
    title: string;
    summary: string;
  }[]
}

export interface NYCTimeoutResponse extends EventResponse {
  from: "Timeout"
}