import React, { useEffect, useState } from "react"
import {Link, useLocation } from "react-router-dom";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";

import "./SearchResults.css"
import { useParams } from "react-router-dom"
import LocationRepository from "../../repositories/LocationRepository";



export default () => {
    const location = useLocation()
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
                                return <Link key={anml.id} to={`/animals/${anml.id}`}>{anml.name}</Link>
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
                        {
                            location.state?.employees.map(emp => {
                                return <Link key={emp.id} to={`/employees/${emp.id}`}>{emp.name}</Link>
                            })
                        }
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
