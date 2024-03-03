import { defineStore } from 'pinia'
import axios from '@axios'

export const useSaleStore = defineStore('SaleStore', {
  actions: {
    // 👉 
    fetchSales(params) {
      return axios.get('/api/admin/v1/sales', { params })
    },

    fetchSale(id) {
      return axios.get(`/api/admin/v1/sales/${id}`)
    },

    create(data){
      return axios.post("/api/admin/v1/sales", data)
    },

    campaign(data){
      return axios.post("/api/admin/v1/sales/campaign", data)
    },
    
    updateById(id, data){
      return axios.put(`/api/admin/v1/sales/${id}`, data)
    },
    deleteById(id){
      return axios.delete(`/api/admin/v1/sales/${id}`)
    }
  },
})
