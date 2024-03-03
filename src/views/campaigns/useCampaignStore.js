import { defineStore } from 'pinia'
import axios from '@axios'

export const useCampaignStore = defineStore('CampaignStore', {
  actions: {
    // 👉 Fetch users data
    fetchCampaigns(params) { return axios.get('/api/admin/v1/campaigns', { params }) },

    // 👉 Add User
    addUser(userData) {
      return new Promise((resolve, reject) => {
        axios.post('/apps/users/user', {
          user: userData,
        }).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // 👉 fetch single user
    fetchUser(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    lockOrUnlockUser(data){
      return axios.post("/api/admin/v1/users", data)
    }
  },
})
