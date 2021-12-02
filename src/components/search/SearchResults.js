import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import "./SearchResults.css"
import { Link, useParams } from "react-router-dom"
import LocationRepository from "../../repositories/LocationRepository";



export default () => {
    const location = useLocation()
    const { employeeId, locationId, animalId } = useParams()
    const [isEmployee, setAuth] = useState(false)
    const { getCurrentUser } = useSimpleAuth()


    useEffect(() => {
        setAuth(getCurrentUser().employee)
    },[])
    
    const displayAnimals = () => {
        if (location.state?.animals.length && isEmployee) {
            return (
                <React.Fragment>
                    <h2>Matching Animals</h2>
                    <section className="animals">
                        {
                            location.state?.animals.map(anml => {
                                return <div key={anml.id}>{anml.name}</div>
                            })
                        }
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayEmployees = () => {
        if (location.state?.employees.length) {
            return (
                <React.Fragment>
                    <h2>Matching Employees</h2>
                    <section className="employees">
                        Display matching employees
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayLocations = () => {
        if (location.state?.locations.length) {
            return (
                <React.Fragment>
                    <h2>Matching Locations</h2>
                    <section className="locations">
                        {
                            location.state?.locations.map(loc => {
                                return <Link className="search-location" to={{
                                    pathname: `/locations/${loc.id}`,
                                    state: { location: location }
                                }}>{loc.name}</Link>
                            })}
                    </section>
                </React.Fragment>
            )
        }
    }

    return (
        <React.Fragment>
            <article className="searchResults">
                {displayAnimals()}
                {displayEmployees()}
                {displayLocations()}
            </article>
        </React.Fragment>
    )
}
