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
    <div className="space-y-2">
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-700">
          <h3 className="text-lg font-semibold leading-snug text-blue-600">
            {title ? (
              <span>
                {index ? `${index}. ${title}` : title}{" "}
                <HiExternalLink className="inline pb-0.5 text-blue-600" />
              </span>
            ) : (
              <span>
                Click here for more details{" "}
                <HiExternalLink className="inline pb-0.5 text-blue-600" />
              </span>
            )}
          </h3>
        </a>
      ) : (
        <h3 className="text-lg font-semibold leading-snug text-slate-900">
          {title ? title : "Event Information"}
        </h3>
      )}
      <div className="text-sm leading-relaxed text-slate-700">
        <Summary text={description} />
      </div>
    </div>
  );
}

function MultiEventView({ events }: { events: EventInfo[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-800">{`There are ${events.length} events here`}</h3>
      <div className="max-h-96 space-y-3 overflow-y-auto overflow-x-hidden pr-1">
        {events.map((event, i) => (
          <div key={`${event.title}-${i}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <OneEventView event={event} index={i + 1} />
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
