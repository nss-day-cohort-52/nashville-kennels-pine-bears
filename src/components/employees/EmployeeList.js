import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"


export default (props) => {
    const [emps, setEmployees] = useState([])

    const syncEmployees = () => {
        EmployeeRepository.getAll().then(setEmployees)
    }

    useEffect(
        () => {
            syncEmployees()
        }, []
    )

    return (
        <>
            <div className="employees">
                {
                    emps.map(a => <Employee key={a.id} employee={a}
                        syncEmployees={syncEmployees}
                    />)
                }
            </div>

        </>
    )
}
