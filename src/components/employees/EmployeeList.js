import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"


export default (props) => {
    const [emps, setEmployees] = useState([])
    const [employees, fireEmployees] = useState([])

    const syncEmployees = () => {
        EmployeeRepository.getAll().then(data => fireEmployees(data))
    }

    useEffect(
        () => {
            EmployeeRepository.getAll().then(setEmployees)
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
