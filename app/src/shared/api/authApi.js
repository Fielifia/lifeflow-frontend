import API from './api'

/**
 * Authenticates user credentials.
 * Stores authenticated user session.
 * @param {{
 *  email:string,
 *  password:string
 * }} credentials - credentials
 * @returns {Promise<object>} Authenticated user
 */
export const login = async ({ email, password }) => {
  const res = await API.post('/auth/login', {
    email,
    password,
  })

  return {
    ...res.data.user,
    token: res.data.token,
  }
}

/**
 * Registers a new user account.
 * Stores authenticated user session.
 * @param {{
 *  email:string,
 *  username:string,
 *  password:string
 * }} credentials - credentials
 * @returns {Promise<object>} Authenticated user
 */
export const register = async ({ email, username, password }) => {
  const res = await API.post('/auth/register', {
    email,
    username,
    password,
  })

  if (!res.data?.user || !res.data?.token) {
    throw new Error('Invalid register response from server')
  }

  return {
    ...res.data.user,
    token: res.data.token,
  }
}
