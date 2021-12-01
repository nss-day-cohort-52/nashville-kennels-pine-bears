import Settings from "./Settings"
import { fetchIt } from "./Fetch"

export default {

    async addNewEmployeeLocation(newEmpLocation) {
        return await fetchIt(
            `${Settings.remoteURL}/employeeLocations`,
            "POST",
            JSON.stringify(newEmpLocation)
        )
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/employeeLocations?_expand=user&_expand=location`)
    },
    async checkCurrentAssignment(userId, locationId) {
        return await fetchIt (`${Settings.remoteURL}/employeeLocations?userId=${userId}&locationId=${locationId}`)
    }
}