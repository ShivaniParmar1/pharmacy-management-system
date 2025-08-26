import Error401 from 'src/pages/401'
import { store } from 'src/store'

const getPermissions = () => {
  const state = store.getState()

  return state.permissions.userPermissions
}

const validateView = (View, module, permission = null) => {
  const userPermission = getPermissions()
  if (permission == null) {
    if (
      userPermission.includes(module + '-read') ||
      userPermission.includes(module + '-write') ||
      userPermission.includes(module + '-update') ||
      userPermission.includes(module + '-delete')
    ) {
      return View
    }
    console.log('validate view failed')

    return Error401
  }
  if (userPermission.includes(module + '-' + permission)) {
    console.log('validate view successfully')

    return View
  }
  console.log('validate view failed')

  return Error401
}

const checkPermission = (module, permission = null) => {
  if (permission == null) {
    if (
      getPermissions().includes(module + '-read') ||
      getPermissions().includes(module + '-write') ||
      getPermissions().includes(module + '-update') ||
      getPermissions().includes(module + '-delete')
    ) {
      return true
    }

    return false
  }
  if (getPermissions().includes(module + '-' + permission)) {
    return true
  }

  return false
}

const hasPermission = (module, permission) => {
  const permissions = getPermissions()

  return permissions.includes(module + '-' + permission)
}

export default {
  validateView,
  checkPermission,
  hasPermission
}
