"use client"

import { capitalize } from "@/app/_utilities/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const filters = ["today", "this-week", "this-month"];

type FilterButtonProps = {
  text: string;
  onClick: (arg0: string) => void;
  active: boolean;
}

const FilterButton = ({ text, onClick, active }: FilterButtonProps) => {
  return (
    <button
      className={`relative cursor-pointer gap-1 px-2 py-1.25 justify-center rounded-lg tracking-normal transition-colors
      ${active? "bg-blue-300" : "bg-gray-100 hover:bg-blue-100"}`}
      onClick={() => onClick(text)}
    >
      {capitalize(text).replace("-", " ")}
    </button>
  );
};

function Filters() {

  const searchParams = useSearchParams();
  const router = useRouter()
  const pathname = usePathname();
  const activeFilter = searchParams.get("filter") ?? filters[1]

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", filter);
    router.replace(`${pathname}?${params.toString()}`, {scroll: false})
  }

  return (
    <div className="inline-block rounded-[10px] bg-gray-100 h-10 w-ax max-w-full items-center z-9999 fixed left-* top-5 right-5 shadow-black p-0.75">
      {filters.map((text) => (
        <FilterButton
          key={text}
          text={text}
          active={activeFilter === text}
          onClick={handleFilter}
        />
      ))}
    </div>
  );
}

export default Filters;
