export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/api/authorization/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
