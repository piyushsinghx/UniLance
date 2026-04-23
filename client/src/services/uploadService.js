import API from './authService';

export const uploadImage = (formData) => API.post('/upload/image', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadMultipleImages = (formData) => API.post('/upload/images', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
