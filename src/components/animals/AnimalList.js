import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Animal } from "./Animal"
import { AnimalDialog } from "./AnimalDialog"
import AnimalRepository from "../../repositories/AnimalRepository"
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository"
import useModal from "../../hooks/ui/useModal"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import OwnerRepository from "../../repositories/OwnerRepository"
import "./AnimalList.css"
import "./cursor.css"
import AnimalCaretakerRepository from "../../repositories/AnimalCaretakerRepository"

export const AnimalListComponent = (props) => {
    const [animals, petAnimals] = useState([])
    const [animalOwners, setAnimalOwners] = useState([])
    const [owners, updateOwners] = useState([])
    const [isEmployee, setAuth] = useState(false)
    const [caretakers, updateCaretakers] = useState([])
    const [currentAnimal, setCurrentAnimal] = useState({ treatments: [] })
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    let { toggleDialog, modalIsOpen } = useModal("#dialog--animal")

    const syncAnimals = () => {
        AnimalRepository.getAll().then(data => petAnimals(data))
    }

    useEffect(() => {
        setAuth(getCurrentUser().employee)
    })

    useEffect(() => {
        OwnerRepository.getAllCustomers().then(updateOwners)
        OwnerRepository.getAllEmployees().then(updateCaretakers)
        AnimalOwnerRepository.getAll().then(setAnimalOwners)
        syncAnimals()
    }, [])

    const showTreatmentHistory = animal => {
        setCurrentAnimal(animal)
        toggleDialog()
    }

    useEffect(() => {
        const handler = e => {
            if (e.keyCode === 27 && modalIsOpen) {
                toggleDialog()
            }
        }

        window.addEventListener("keyup", handler)

        return () => window.removeEventListener("keyup", handler)
    }, [toggleDialog, modalIsOpen])

    const currentAnimalOwner = () => {
        const user = getCurrentUser()

        const newAnimalArray = animals.filter((animal) => {
            for (const animalOwner of animal.animalOwners) {
                if (animalOwner.userId === user.id) {

                    return true
                }
            }
        })
        return newAnimalArray
    }

    return (
        <>
            <AnimalDialog toggleDialog={toggleDialog} animal={currentAnimal} setCurrentAnimal={setCurrentAnimal} />

            {
                isEmployee
                    ? <div className="centerChildren btn--newResource">
                        <button className="btn btn-success " onClick={() => { history.push(`./animals/treatments`) }}
                        >Add Treatment</button>
                    </div>
                    : <div className="centerChildren btn--newResource">
                        <button type="button"
                            className="btn btn-success "
                            onClick={() => { history.push("/animals/new") }}>
                            Register Animal
                        </button>
                    </div>
            }


            <ul className="animals">
                {
                    isEmployee
                        ?
                        animals.map(anml =>
                            <Animal key={`animal--${anml.id}`} animal={anml}
                                animalOwners={animalOwners}
                                owners={owners}
                                caretakers={caretakers}
                                syncAnimals={syncAnimals}
                                setAnimalOwners={setAnimalOwners}
                                showTreatmentHistory={showTreatmentHistory}
                            />)
                        :
                        currentAnimalOwner().map(anml =>
                            <Animal key={`animal--${anml.id}`} animal={anml}
                                animalOwners={animalOwners}
                                owners={owners}
                                caretakers={caretakers}
                                syncAnimals={syncAnimals}
                                setAnimalOwners={setAnimalOwners}
                                showTreatmentHistory={showTreatmentHistory}
                            />)
                }
            </ul>
        </>
    )
}
