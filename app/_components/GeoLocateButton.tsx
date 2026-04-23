function GeoLocateButton({onClick, loading}: {onClick: () => void, loading: boolean}) {

  return (
    <button
      className="z-10000 cursor-pointer top-11/12 left-1/2 transform -translate-x-1/2 -trnaslate-y- absolute rounded-full bg-blue-400 p-2 drop-shadow-2xl"
      type="button"
      onClick={onClick}
    >
      {loading ? ("Retrieving location..."):("Pin my location")}
    </button>
  );
}

export default GeoLocateButton;
