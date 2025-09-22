import React, { useEffect } from 'react'

export default function Rapport({salutation}) {

  useEffect(() => {
    document.title = "Rapport d'anomalie";
  }, [])

  return (
    <div>
        Rapport
        {salutation}
    </div>
  )
}
