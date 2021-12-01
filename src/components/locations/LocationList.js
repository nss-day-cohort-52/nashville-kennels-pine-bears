import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import LocationRepository from "../../repositories/LocationRepository";
import Location from "./Location"
import "./LocationList.css"


export const LocationList = () => {
    const [locations, updateLocations] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()

    useEffect(() => {
        LocationRepository.getAll().then(updateLocations)
    }, [])

    return (
        <>
            {
                getCurrentUser().employee
                    ? <div className="centerChildren btn--newResource">
                        <button className="btn btn-success" onClick={() => { history.push("/locations/assign") }}
                        >Assign employee</button>
                    </div>
                    : ""
            }

            <div className="locations">
                {locations.map(l => <Location key={l.id} location={l} />)}
            </div>
        </>
    )
}
