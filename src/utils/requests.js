import instance from './interrept.js'

// GET请求
export const get = (url, params = {}, config = {}) => {
  return instance.get(url, { params, ...config })
}

// POST请求
export const post = (url, data = {}, config = {}) => {
  return instance.post(url, data, config)
}

// PUT请求
export const put = (url, data = {}, config = {}) => {
  return instance.put(url, data, config)
}

// PATCH请求
export const patch = (url, data = {}, config = {}) => {
  return instance.patch(url, data, config)
}

// DELETE请求
export const del = (url, config = {}) => {
  return instance.delete(url, config)
}

// 文件上传请求
export const upload = (url, file, config = {}) => {
  const formData = new FormData()
  formData.append('file', file)
  return instance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}

// 文件下载请求
export const download = (url, params = {}, filename = 'file', config = {}) => {
  return instance.get(url, {
    params,
    responseType: 'blob',
    ...config
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  })
}