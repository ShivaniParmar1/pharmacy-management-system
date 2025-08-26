// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const navigation = []
mock.onGet('/api/vertical-nav/data').reply(() => {
  return [200, navigation]
})
