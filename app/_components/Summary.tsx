function Summary({ text }: { text: string | null }) {
  const displayText =
    text === null
      ? "We could not find any details about this event"
      : text
          .split(/(?<=[.!?])\s+/)
          .slice(0, 2)
          .join(" ");

  return <span>{displayText} </span>;
}

export default Summary;
