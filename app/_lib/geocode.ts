export async function geocodeAddress(address: string) {
  const encoded = encodeURIComponent(address)

  const res = await fetch(`api/geocode/${encoded}`)

  const data = await res.json()

  if(!res.ok) {
    throw new Error(data.error ?? "Unknown error")
  }

  return data
}