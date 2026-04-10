
function Summary({ text, link }: { text: string, link: string | null }) {

  const displayText = text.split(/(?<=[.!?])\s+/).slice(0,2).join(" ")

  return (
    <span>
      {displayText}{" "}
      {link &&
        <a href={link} target="_blank" rel="noopener noreferrer">
          <span>More Info</span>
        </a>
      }
    </span>);
}

export default Summary;
