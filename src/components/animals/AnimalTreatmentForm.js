import React, { useEffect, useState } from "react"
import AnimalRepository from "../../repositories/AnimalRepository"


export const AnimalTreatmentForm = () => {
    const [animals, setAnimals] = useState([])

    useEffect(() => {
        AnimalRepository.getAll().then(setAnimals)
    }, [])
    
    return( 
        <form className="animalForm">
            <h2>Add a Treatment</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <select
                    className="form-control">
                    <option value="">Select an Animal</option>
                    {
                        animals.map(a => {
                            return <option>{a.name}</option>
                        })
                    }
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    // onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Description"
                />

            </div>

            {/* <div className="form-group">
                <label htmlFor="employee">Make appointment with caretaker</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    // onChange={e => setEmployeeId(e.target.value)}
                >
                    <option value="">Select an employee</option>

                    ))
                </select>
            </div> */}
            
            <button type="submit"
                // onClick={constructNewAnimal}
                // disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}