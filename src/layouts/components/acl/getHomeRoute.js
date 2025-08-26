/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'client') return '/dashboard'
  else return '/dashboard'
}

export default getHomeRoute
