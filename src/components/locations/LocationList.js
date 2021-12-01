import React, { useEffect, useState } from "react"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import LocationRepository from "../../repositories/LocationRepository";
import Location from "./Location"
import "./LocationList.css"


export const LocationList = () => {
    const [locations, updateLocations] = useState([])
    const { getCurrentUser } = useSimpleAuth()

    useEffect(() => {
        LocationRepository.getAll().then(updateLocations)
    }, [])

    return (
        <>
            {
                getCurrentUser().employee
                    ? <div className="centerChildren btn--newResource">
                        <button className="btn btn-success "
                        >Add Treatment</button>
                    </div>
                    : "effaf"
            }

            <div className="locations">
                {locations.map(l => <Location key={l.id} location={l} />)}
            </div>
        </>
    )
}
