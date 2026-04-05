import supabase from "@/app/_lib/supabase";

export async function getEvents(): Promise<
  {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    link: string;
  }[]
> {
  const { data, error } = await supabase
    .from("events")
    .select("title, description, latitude, longitude, link");

  if (error) {
    console.error(error);
    throw new Error("Unable to fetch events");
  }

  return data;
}
