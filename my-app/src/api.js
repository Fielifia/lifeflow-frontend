import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export const getTestMessage = async () => {
    try {
        const response = await axios.get(`${API_URL}/`)
        return response.data
    } catch (error) {
        console.error('Error fetching test message:', error)
        return null
    }
}
