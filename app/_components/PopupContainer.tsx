import { HiExternalLink } from "react-icons/hi";

type PopupContainerProps = {
  title?: string;
  link?: string;
  description?: string;
};

function PopupContainer({ title, link, description }: PopupContainerProps) {
  return (
    <div>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <h3 className="text-lg">

          <span>{title} <HiExternalLink className="inline pb-0.5"/></span>
        </h3>
      </a>
      <p>{description}</p>
    </div>
  );
}

export default PopupContainer;
