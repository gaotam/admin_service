import { defineStore } from 'pinia'
import axios from '@axios'

export const useLiveStore = defineStore('LiveStore', {
  actions: {
    // 👉 
    fetchLives(params) {
      return axios.get('/api/admin/v1/lives', { params })
    },

    fetchViewLives() {
      return axios.get(`/api/admin/v1//lives/analyst`)
    },

    createBanner(data){
      const form = new FormData();
      form.append("page", data.page.value);
      form.append("position", data.position.value);
      form.append("type", data.type.value);
      form.append("content", data.content);
      form.append("redirect_link", data.redirect_link);
      form.append("image", data.image[0]);

      return axios.post("/api/admin/v1/banners", form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    updateById(id, data){
      const form = new FormData();
      form.append("page", data.page.value);
      form.append("position", data.position.value);
      form.append("type", data.type.value);
      form.append("content", data.content);
      form.append("redirect_link", data.redirect_link);
      form.append("image", data.image[0]);

      return axios.put(`/api/admin/v1/banners/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    deleteById(id){
      return axios.delete(`/api/admin/v1/lives/${id}`)
    }
  },
})
