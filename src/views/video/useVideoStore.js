import { defineStore } from 'pinia'
import axios from '@axios'

export const useVideoStore = defineStore('ProductStore', {
  actions: {
    // 👉 
    fetchVideos(params) {
      return axios.get('/api/admin/v1/videos', { params })
    },

    fetchProductWarehouse(params) {
      return axios.get('/api/admin/v1/products/warehouse', { params })
    },

    fetchPost(id) {
      return axios.get(`/api/admin/v1/products/${id}`)
    },

    createProduct(data){
      const form = new FormData();
      for(const key in data){
        if(key == 'images'){
          for(let file of data.images){
            console.log(file);
            form.append("images", file);
          }
        } else if(key == 'sizes' || key == 'style' || key == 'tags'){
          form.append(key, JSON.stringify(data[key]));
        } else {
          form.append(key, data[key]);
        }
      }

      return axios.post("/api/admin/v1/products", form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    updateById(id, data){
      const form = new FormData();
      for(const key in data){
        if(key == 'images'){
          for(let file of data.images){
            form.append("images", file);
          }
        } else if(key == 'sizes' || key == 'style' || key == 'tags'){
          form.append(key, JSON.stringify(data[key]));
        } else {
          form.append(key, data[key]);
        }
      }

      return axios.put(`/api/admin/v1/products/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    deleteById(id){
      return axios.delete(`/api/admin/v1/videos/${id}`)
    }
  },
})
