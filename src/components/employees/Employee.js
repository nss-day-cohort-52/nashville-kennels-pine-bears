import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import LocationRepository from "../../repositories/LocationRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import AnimalRepository from "../../repositories/AnimalRepository";


export default ({ employee, syncEmployees }) => {
    const [location, markLocation] = useState({})
    const [classes, defineClasses] = useState("card employee")
    const { employeeId, locationId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const [isEmployee, setAuth] = useState(false)
    const [animals, setAnimals] = useState([])

    useEffect(() => {
        setAuth(getCurrentUser().employee)
    })

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource.employeeLocations[0])
        }
        resolveResource(location, locationId, LocationRepository.get)
    }, [])

    useEffect(() => {
        AnimalRepository.getAll()
            .then(setAnimals)
    }, [])


    const displayTreatmentCount = () => {
        const treatArr = []
        for (const animal of animals) {
            for (const caretaker of animal.animalCaretakers) {
                for (const treatment of animal.treatments) {
                    if (treatment.animalId === caretaker.animalId && caretaker.userId === resource.id) {
                        treatArr.push(treatment)
                    }
                }
            }
        }
        return treatArr
    }

    const arrOfTreatments = displayTreatmentCount()

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>
                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for {resource.animals?.length ? resource.animals?.length : 0} {resource.animals?.length > 1 || resource.animals?.length === 0 ? "animals" : "animal"}
                            </section>
                            <section>
                                Treatment count: {arrOfTreatments.length ? arrOfTreatments.length : 0} {arrOfTreatments.length > 1 || arrOfTreatments.length === 0 ? "treatments" : "treatment"}
                            </section>
                            <section>
                                Works at
                                {
                                    resource.locations?.length > 0
                                        ?
                                        resource.locations?.map((l) => {
                                            return <Link key={l.id} className="employee-location"
                                                to={`/locations/${l.location.id}`}> {l.location.name} </Link>
                                        })
                                        : <div>Works at <span style={{ color: "red" }}>UNASSIGNED</span></div>
                                }
                            </section>
                        </>
                        : ""
                }
                {
                    isEmployee
                        ? <button className="btn--fireEmployee" onClick={(evt) => {
                            EmployeeRepository
                                .delete(resource.id)
                                .then(() => { syncEmployees() }) // Get all employees
                        }}>Fire</button>
                        : ""
                }
            </section>
        </article>
    )
}
