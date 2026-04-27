import API from './api'

export const login = async ({ email, password }) => {
  const res = await API.post('/auth/login', { email, password })

  const userWithToken = {
    ...res.data.user,
    token: res.data.token,
  }

  localStorage.setItem('user', JSON.stringify(userWithToken))

  return userWithToken
}

export const register = async ({ email, username, password }) => {
  const res = await API.post('/auth/register', {
    email,
    username,
    password,
  })

  if (!res.data?.user || !res.data?.token) {
    throw new Error('Invalid register response from server')
  }

  const userWithToken = {
    ...res.data.user,
    token: res.data.token,
  }

  localStorage.setItem('user', JSON.stringify(userWithToken))

  return userWithToken
}
