import { fetchIt } from "./Fetch"
import Settings from "./Settings"

export default {
    async get(params) {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers/${params}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
            }
        })
        return await e.json()
    },
    async delete(id) {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
            }
        })
        return await e.json()
    },
    async getCaretakersByAnimal(animalId) {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers?animalId=${animalId}&_expand=user`)
        return await e.json()
    },
    async assignCaretaker(animalId, userId) {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("kennel_token")}`
            },
            "body": JSON.stringify({ animalId, userId })
        })
        return await e.json()
    },
    async checkCurrentAssignment(userId, animalId) {
        return await fetchIt(`${Settings.remoteURL}/animalCaretakers?userId=${userId}&animalId=${animalId}`)
    },
    async getAll() {
        const e = await fetch(`${Settings.remoteURL}/animalCaretakers?_expand=user&_expand=animal`)
        return await e.json()
    }
}