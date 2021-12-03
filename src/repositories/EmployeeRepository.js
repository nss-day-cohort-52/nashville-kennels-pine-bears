import Settings from "./Settings"
import { fetchIt } from "./Fetch"


export default {
    async get(id) {
        const userLocations = await fetchIt(`${Settings.remoteURL}/employeeLocations?userId=${id}&_expand=location&_expand=user`)
        const userAnimalCare = await fetchIt(`${Settings.remoteURL}/animalCaretakers?userId=${id}&_expand=animal&_expand=user`)
        return await fetchIt(`${Settings.remoteURL}/users?employee=true&userId=${id}`)
            .then(data => {
                // debugger
                if (userLocations.length > 0) {
                    const userWithRelationships = userLocations[0].user
                    userWithRelationships.locations = userLocations
                    userWithRelationships.animals = userAnimalCare
                    return userWithRelationships
                }
                else if (userAnimalCare.length === 0) {
                    return data
                }
                else {
                    const userWithRelationships = userAnimalCare[0].user
                    userWithRelationships.animals = data
                    return userWithRelationships
                }
            })
    },
    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/users/${id}`, "DELETE")
    },

    async addEmployee(employee) {
        return await fetchIt(`${Settings.remoteURL}/users`, "POST", JSON.stringify(employee))
    },
    async assignEmployee(rel) {
        return await fetchIt(`${Settings.remoteURL}/employeeLocations`, "POST", JSON.stringify(rel))
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/users?employee=true&_embed=employeeLocations`)
    }
}
