
function Summary({ text }: { text: string }) {

  const displayText = text.split(/(?<=[.!?])\s+/).slice(0,2).join(" ")

  return (
    <span>
      {displayText}{" "}
    </span>);
}

export default Summary;
