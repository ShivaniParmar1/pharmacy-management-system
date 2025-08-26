// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const navigation = []
mock.onGet('/api/horizontal-nav/data').reply(() => {
  return [200, navigation]
})
