export type EventDataResponse = {
  title: string;
  description: string;
  longitude: number;
  latitude: number;
  link: string;
}

export type EventLocations = {
  latitude: number;
  longitude: number;
  events: {
    title: string;
    description: string;
    link: string;
  }[]
}