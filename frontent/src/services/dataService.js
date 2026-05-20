import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats')
};

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`)
};

export const teacherService = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`)
};

export const classService = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`)
};

export const subjectService = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`)
};

export const attendanceService = {
  mark: (data) => api.post('/attendance/mark', data),
  getAll: (params) => api.get('/attendance', { params }),
  getStats: (params) => api.get('/attendance/stats', { params })
};

export const examService = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  addResults: (id, data) => api.post(`/exams/${id}/results`, data),
  getResults: (id) => api.get(`/exams/${id}/results`)
};

export const feeService = {
  getAll: (params) => api.get('/fees', { params }),
  create: (data) => api.post('/fees', data),
  update: (id, data) => api.put(`/fees/${id}`, data),
  pay: (id, data) => api.post(`/fees/${id}/pay`, data),
  delete: (id) => api.delete(`/fees/${id}`),
  getStats: () => api.get('/fees/stats')
};

export const noticeService = {
  getAll: (params) => api.get('/notices', { params }),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`)
};

export const timetableService = {
  getAll: (params) => api.get('/timetable', { params }),
  createOrUpdate: (data) => api.post('/timetable', data),
  delete: (id) => api.delete(`/timetable/${id}`)
};
