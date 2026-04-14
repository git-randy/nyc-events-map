function GeoLocateButton({onClick, loading}: {onClick: () => void, loading: boolean}) {

  return (
    <button
      className="z-10000 cursor-pointer right-1/2 bottom-10 absolute rounded-full bg-blue-400 p-2 drop-shadow-2xl"
      type="button"
      onClick={onClick}
    >
      {loading ? ("Retrieving location..."):("Pin my location")}
    </button>
  );
}

export default GeoLocateButton;
