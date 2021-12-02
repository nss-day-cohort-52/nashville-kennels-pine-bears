import React, { useState, useEffect } from "react"
import { useHistory } from "react-router"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalCaretakerRepository from "../../repositories/AnimalCaretakerRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import LocationRepository from "../../repositories/LocationRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";

export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [locations, setLocations] = useState([])
    const [employees, setEmployees] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()

    useEffect(() => {
        EmployeeRepository.getAll().then(setEmployees)
    }, [])

    useEffect(() => {
        LocationRepository.getAll().then(setLocations)
    }, [])

    const currentUserId = getCurrentUser().id

    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(employeeId)
        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const emp = employees.find(e => e.id === eId)
            const findLocation = () => {
                const empLocations = emp.employeeLocations
                for (const empLocation of empLocations) {
                    for (const location of locations) {
                        if (location.id === empLocation.locationId) {
                            return location
                        }
                    }
                }
            }
            const foundLocation = findLocation()
            const animal = {
                name: animalName,
                breed: breed,
                locationId: foundLocation?.id
            }


            AnimalRepository.addAnimal(animal)
                .then((newAnimal) => { AnimalCaretakerRepository.assignCaretaker(newAnimal.id, eId) && AnimalOwnerRepository.assignOwner(newAnimal.id, currentUserId) })
                .then(() => setEnabled(true))
                .then(() => { history.push("/animals") })
        }
    }

    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>
            <div className="form-group">
                <label htmlFor="employee">Make appointment with caretaker</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={e => setEmployeeId(e.target.value)}
                >
                    <option value="">Select an employee</option>
                    {employees.map(e => (
                        <option key={e.id} id={e.id} value={e.id}>
                            {e.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit"
                onClick={(evt) => { constructNewAnimal(evt) }}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
