import Summary from "@/app/_components/Summary"
import { HiExternalLink } from "react-icons/hi";

type EventInfo = {
  title: string;
  link: string | null;
  description: string;
};

function OneEventView({event}: {event: EventInfo}) {

  const {title, link, description} = event

  return (
    <div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg">
            {title ? (
              <span>
                {title} <HiExternalLink className="inline pb-0.5" />
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
        <h3 className="text-lg">
          {title ? title : "Event Information"}
        </h3>
      )}
      <Summary text={description} link={link}/>
    </div>
  )
}

function MultiEventView({events}: {events: EventInfo[]}) {

  return (
  <div className="max-h-96 overflow-scroll overflow-x-hidden">
    <h3 className="mb-1 font-bold">{`There are ${events.length} events here`}</h3>
    {events.map((event) => (
      <div key={event.title} className="mb-2 border-b">
        {event.link ? (
          <a href={event.link} target="_blank" rel="noopener noreferrer">
            <h3 className="text-lg">
              {event.title ? (
                <span>
                  {event.title} <HiExternalLink className="inline pb-0.5" />
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
          <h3 className="text-lg">
            {event.title ? event.title : "Event Information"}
          </h3>
        )}
        <Summary text={event.description} link={event.link}/>
      </div>
    ))}
  </div>
  );
}


function PopupInfo({eventList}: {eventList: EventInfo[]}) {

  if (eventList.length === 1) {
    return (
      <OneEventView event={eventList[0]}/>
    )
  } else if (eventList.length > 1) {
    return (
      <MultiEventView events={eventList}/>
    )
  }


}

export default PopupInfo;
