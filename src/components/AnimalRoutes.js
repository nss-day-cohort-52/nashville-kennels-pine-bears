import React from "react"
import { Route } from "react-router-dom"
import {Animal} from "./animals/Animal"
import AnimalForm from "./animals/AnimalForm"
import { AnimalListComponent } from "./animals/AnimalList"
import { AnimalTreatmentForm } from "./animals/AnimalTreatmentForm"

export default () => {
    return (
        <>
            <Route exact path="/animals">
                <AnimalListComponent />
            </Route>
            <Route path="/animals/:animalId(\d+)">
                <Animal />
            </Route>
            <Route path="/animals/new">
                <AnimalForm />
            </Route>
            <Route path="/animals/treatments">
                <AnimalTreatmentForm />
            </Route>
        </>
    )
}
