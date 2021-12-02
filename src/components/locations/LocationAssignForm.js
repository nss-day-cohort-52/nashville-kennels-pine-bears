import React, { useState, useEffect } from "react"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import EmployeeLocationRepository from "../../repositories/EmployeeLocationRepository"
import LocationRepository from "../../repositories/LocationRepository";

import { useHistory } from "react-router-dom"

export const LocationAssignForm = () => {
    const [employees, setEmployees] = useState([])
    const [locations, setLocations] = useState([])
    const [empId, setEmpId] = useState(0)
    const [locationId, setLocationId] = useState(0)
    const history = useHistory()


    useEffect(() => {
        EmployeeRepository.getAll().then(setEmployees)
    }, [])

    useEffect(() => {
        LocationRepository.getAll().then(setLocations)
    }, [])



    const constructNewEmployeeLocation = (evt) => {
        evt.preventDefault()
        const eId = parseInt(empId)
        const locId = parseInt(locationId)



        if (eId === 0 || locId === 0) {
            window.alert("Please fill out all fields")
        } else {
            const empLocation = {
                userId: parseInt(empId),
                locationId: parseInt(locationId),
            }

            {
                
                EmployeeLocationRepository.checkCurrentAssignment(empId, locationId).then((data) => {
                    if (data.length > 0) {
                        window.alert("Employee is already assigned to this location")
                    } else {
                        EmployeeLocationRepository.addNewEmployeeLocation(empLocation)
                            .then(() => { history.push("/locations") })
                        
                    }
                })
            
        }

        }
    }


    return (
        <form className="animalForm">
            <h2>Assign an Employee</h2>
            <div className="form-group">
                <label htmlFor="animalName">Employee</label>
                <select
                    className="form-control"
                    onChange={e => setEmpId(e.target.value)}
                >
                    <option value="0">Select an Employee</option>
                    {
                        employees.map(emp => {
                            return <option key={emp.id} value={emp.id}>{emp.name}</option>
                        })
                    }

                </select>

                <label htmlFor="animalName">Location</label>
                <select
                    className="form-control"
                    onChange={e => setLocationId(e.target.value)}
                >
                    <option value="0">Select a Location</option>
                    {
                        locations.map(location => {
                            return <option key={location.id} value={location.id}>{location.name}</option>
                        })
                    }

                </select>
            </div>
            <button type="submit"
                // onClick=
                // {
                //         (evt) => {
                //         EmployeeLocationRepository.checkCurrentAssignment(empId, locationId).then((data) => {
                //             if (data.length > 0) {
                //                 window.alert("Employee is already assigned to this location")
                //             } else {
                //                 constructNewEmployeeLocation(evt)
                //             }
                //         })
                //     }
                // }
                onClick={(evt) => {constructNewEmployeeLocation(evt)}}
                className="btn btn-primary"> Assign </button>
        </form>
    )
}