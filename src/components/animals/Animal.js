import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import AnimalCaretakerRepository from "../../repositories/AnimalCaretakerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import "./AnimalCard.css"

export const Animal = ({ animal, syncAnimals,
    showTreatmentHistory, owners, caretakers }) => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEmployee, setAuth] = useState(false)
    const [myOwners, setPeople] = useState([])
    const [myCaretakers, setCaretakers] = useState([])
    const [allOwners, registerOwners] = useState([])
    const [allCaretakers, registerCaretakers] = useState([])
    const [classes, defineClasses] = useState("card animal")
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(animal, animalId, AnimalRepository.get)
    }, [animal])

    useEffect(() => {
        if (owners) {
            registerOwners(owners)
        }
    }, [owners])


    useEffect(() => {
        if (caretakers) {
            registerCaretakers(caretakers)
        }
    }, [caretakers])

    const getPeople = () => {
        if ("id" in currentAnimal) {
            AnimalOwnerRepository
                .getOwnersByAnimal(currentAnimal.id)
                .then(people => setPeople(people))
        }
    }

    const getCaretakers = () => {
        if ("id" in currentAnimal) {
            AnimalCaretakerRepository
                .getCaretakersByAnimal(currentAnimal.id)
                .then(caretakers => setCaretakers(caretakers))
        }
    }

    useEffect(() => {
        getPeople()
    }, [currentAnimal])

    useEffect(() => {
        getCaretakers()
    }, [currentAnimal])

    useEffect(() => {
        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)

            AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                .then(() => {
                    OwnerRepository.getAllCustomers()
                        .then(registerOwners)
                })
        }
    }, [animalId])

    useEffect(() => {
        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)

            AnimalCaretakerRepository.getCaretakersByAnimal(animalId).then(d => setCaretakers(d))
                .then(() => {
                    OwnerRepository.getAllEmployees()
                        .then(registerCaretakers)
                })
        }
    }, [animalId])

    const assignNewCaretaker = (e) => {
        e.persist()
        AnimalCaretakerRepository.checkCurrentAssignment(parseInt(e.target.value), currentAnimal.id).then(data => {
            if (data.length > 0) {
                window.alert("That caretaker is already assigned to this animal!")
            }
            else {
                AnimalCaretakerRepository
                    .assignCaretaker(currentAnimal.id, parseInt(e.target.value))
                    .then(syncAnimals)
            }
        })
    }
    const assignNewOwner = (e) => {
        e.persist()
        AnimalOwnerRepository.checkCurrentAssignment(parseInt(e.target.value), currentAnimal.id).then(data => {
            if (data.length > 0) {
                window.alert("That owner is already assigned to this animal!")
            }
            else {
                AnimalOwnerRepository
                    .assignOwner(currentAnimal.id, parseInt(e.target.value))
                    .then(syncAnimals)
            }
        })
    }

    return (
        <>
            <li className={classes}>
                <div className="card-body">
                    <div className="animal__header">
                        <h5 className="card-title">
                            <button className="link--card btn btn-link"
                                style={{
                                    cursor: "pointer",
                                    "textDecoration": "underline",
                                    "color": "rgb(94, 78, 196)"
                                }}
                                onClick={() => {
                                    if (isEmployee) {
                                        showTreatmentHistory(currentAnimal)
                                    }
                                    else {
                                        history.push(`/animals/${currentAnimal.id}`)
                                    }
                                }}> {currentAnimal.name} </button>
                        </h5>
                        <span className="card-text small">{currentAnimal.breed}</span>
                    </div>

                    <details open={detailsOpen}>
                        <summary className="smaller">
                            <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                        </summary>

                        <section>
                            <h6>Caretaker(s)</h6>
                            <span className="small">
                                {
                                    myCaretakers.map(c => {
                                        return <div key={c.id}>{c.user?.name}</div>
                                    })
                                }
                            </span>
                            {
                                myCaretakers.length < 2 && isEmployee
                                    ? <select defaultValue=""
                                        name="caretaker"
                                        className="form-control small"
                                        onChange={assignNewCaretaker} >
                                        <option value="">
                                            Select {myCaretakers.length === 1 ? "another" : "an"} caretaker
                                        </option>
                                        {
                                            allCaretakers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                        }
                                    </select>
                                    : null
                            }

                            <h6>Owner(s)</h6>
                            <span className="small">
                                {
                                    myOwners.map(o => {
                                        return (
                                            <div key={o.id}>{o.user?.name}</div>
                                        )
                                    })
                                }
                            </span>
                            {
                                myOwners.length < 2 && isEmployee
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={assignNewOwner} >
                                        <option value="">
                                            Select {myOwners.length === 1 ? "another" : "an"} owner
                                        </option>
                                        {
                                            allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }
                            {
                                detailsOpen && "treatments" in currentAnimal
                                    ? <div className="small">
                                        <h6>Treatment History</h6>
                                        {
                                            currentAnimal.treatments.map(t => (
                                                <div key={t.id}>
                                                    <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                        {new Date(t.timestamp).toLocaleString("en-US")}
                                                    </p>
                                                    <p>{t.description}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : ""
                            }
                        </section>

                        {
                            isEmployee
                                ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                    AnimalOwnerRepository
                                        .removeOwnersAndCaretakers(currentAnimal.id)
                                        .then(() => { AnimalRepository.delete(currentAnimal.id) }) // Remove animal
                                        .then(syncAnimals)
                                }>Discharge</button>
                                : ""
                        }

                    </details>
                </div>
            </li>
        </>
    )
}
