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
    <aside
      className={`fixed left-0 top-0 h-screen z-40 border-r border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-6" : "w-80 lg:w-96"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-6 absolute -right-3 top-1/2 translate-y-1/2 bg-slate-50 border border-slate-200 rounded-r-md p-2 shadow-md hover:bg-slate-100 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <HiChevronRight className="w-4 h-4 text-slate-600" />
        ) : (
          <HiChevronLeft className="w-4 h-4 text-slate-600" />
        )}
      </button>

      {!isCollapsed && (
        <div className="p-4 max-h-dvh">
          <h2 className="mb-4 text-xl font-semibold">Other Events</h2>
          <div className="space-y-4 max-h-screen overflow-y-auto pr-1">
            <p className="text-sm text-slate-700">
              Events hard to pinpoint are shown here
            </p>
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
  );
}

export default Sidebar;
