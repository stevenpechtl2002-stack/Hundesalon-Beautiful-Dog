import { useState, useEffect } from 'react'
import { client } from '../sanityClient'

export function useSanityQuery(query, fallback = null) {
  const [data, setData] = useState(fallback)

  useEffect(() => {
    client.fetch(query).then(setData).catch(() => {})
  }, [query])

  return data
}
