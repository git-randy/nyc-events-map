import Summary from "@/app/_components/Summary";
import { HiExternalLink } from "react-icons/hi";

type EventInfo = {
  title: string;
  link: string | null;
  description: string;
};

function OneEventView({ event, index }: { event: EventInfo; index?: number }) {
  const { title, link, description } = event;

  return (
    <div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg">
            {title ? (
              <span>
                {index ? `${index}. ${title}` : title}{" "}
                <HiExternalLink className="inline pb-0.5" />
              </span>
            ) : (
              <span>
                Click here for more details{" "}
                <HiExternalLink className="inline pb-0.5" />
              </span>
            )}
          </h3>
        </a>
      ) : (
        <h3 className="text-lg">{title ? title : "Event Information"}</h3>
      )}
      <Summary text={description} link={link} />
    </div>
  );
}

function MultiEventView({ events }: { events: EventInfo[] }) {
  return (
    <div>
      <h3 className="mb-1 font-bold">{`There are ${events.length} events here`}</h3>
      <div className="max-h-96 overflow-scroll overflow-x-hidden">
        {events.map((event, i) => (
          <div key={event.title} className="mb-2 border-b">
            <OneEventView key={event.title} event={event} index={i + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PopupInfo({ eventList }: { eventList: EventInfo[] }) {
  if (eventList.length === 1) {
    return <OneEventView event={eventList[0]} />;
  } else if (eventList.length > 1) {
    return <MultiEventView events={eventList} />;
  }
}

export default PopupInfo;
