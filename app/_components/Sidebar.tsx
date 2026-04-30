import { EventLocations } from "@/app/_lib/types";
import { HiExternalLink, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Summary from "@/app/_components/Summary";
import { useState } from "react";

type SidebarProps = {
  noLocationEvents?: EventLocations;
};

function Sidebar({ noLocationEvents }: SidebarProps) {
  const eventList = noLocationEvents?.events ?? [];
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (eventList.length === 0) {
    return null;
  }

  return (
    <>
      <div
        role="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`fixed p-6 w-6 z-20 top-1/2 translate-y-1/2 group transition-all duration-300 ease-in-out ${isCollapsed ? "left-4" : "left-80 lg:left-94"}`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`relative w-6 bg-slate-50 border border-slate-200 rounded-r-md p-2 right-5 shadow-md group-hover:bg-slate-100`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <HiChevronRight className="relative -left-1 w-4 h-4 text-slate-600"/>
          ) : (
            <HiChevronLeft className="relative -left-1 w-4 h-4 text-slate-600"/>
          )}
        </button>
      </div>
      <aside
        className={`fixed left-0 top-0 h-screen z-40 border-r border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-6" : "w-80 lg:w-96"
        }`}
      >
        {!isCollapsed && (
        <div className="p-4 max-h-dvh">
          <div className="overflow-auto">
          <h2 className="mb-4 text-xl font-semibold max-w-full">Other Events</h2>
          <p className="text-sm text-slate-700 mb-4">
              Events hard to pinpoint are shown here
          </p>
          </div>
          <div className="space-y-4 max-h-screen overflow-y-auto pr-1">
            {eventList.map((event, index) => (
              <div
                key={`${event.title}-${index}`}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                {event.link ? (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="mb-1 text-lg font-semibold">
                      {index + 1}. {event.title}{" "}
                      <HiExternalLink className="inline pb-0.5" />
                    </h3>
                  </a>
                ) : (
                  <h3 className="mb-1 text-lg font-semibold">
                    {index + 1}. {event.title || "Event Information"}
                  </h3>
                )}
                <Summary text={event.description} />
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
    </>
  );
}

export default Sidebar;
