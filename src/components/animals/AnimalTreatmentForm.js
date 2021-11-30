import React, { useEffect, useState } from "react"
import { useHistory } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository"


export const AnimalTreatmentForm = () => {
    const [animals, setAnimals] = useState([])
    const [animalId, setAnimalId] = useState(0)
    const [description, setDescription] = useState("")
    const history = useHistory()

    const constructNewAnimalTreatment = evt => {
        evt.preventDefault()
        const aId = parseInt(animalId)

        if (aId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const treatment = {
                animalId: parseInt(animalId),
                description: description,
                timestamp: Date.now()
            }
        
            AnimalRepository.addAnimalTreatment(treatment)
                .then(() => history.push("/animals")
                
                )}
            }

    useEffect(() => {
        AnimalRepository.getAll().then(setAnimals)
    }, [])
    
    return( 
        <form className="animalForm">
            <h2>Add a Treatment</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <select
                    className="form-control"
                    onChange={a => setAnimalId(a.target.value)}>
                    <option value="0">Select an Animal</option>
                    {
                        animals.map(a => {
                            return <option key={a.id} value={a.id}>{a.name}</option>
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
                    onChange={e => setDescription(e.target.value)}
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
                onClick={constructNewAnimalTreatment}
                // disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}