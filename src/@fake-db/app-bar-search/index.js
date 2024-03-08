// ** Mock Adapter
import mock from '@/@fake-db/mock'

const database = [
  {
    id: 1,
    icon: 'tabler-category',
    title: 'Quản lý thể loại',
    url: { name: 'categories-list' },
    category: 'dashboards',
  },
  {
    id: 2,
    icon: 'tabler-user',
    title: 'Quản lý người dùng',
    url: { name: 'users-list' },
    category: 'dashboards',
  },
  {
    id: 3,
    icon: 'tabler-video',
    title: 'Quản lý sản phẩm',
    url: {
      name: 'products-list',
    },
    category: 'dashboards',
  },
  {
    id: 5,
    icon: 'tabler-article',
    title: 'Quản lý bài viết',
    url: {
      name: 'posts-list',
    },
    category: 'dashboards',
  },
  {
    id: 6,
    icon: 'tabler-link',
    title: 'Quản lý chiến dịch',
    url: {
      name: 'apps-invoice-list',
    },
    category: 'dashboards',
  },
  {
    id: 7,
    icon: 'tabler-building-warehouse',
    title: 'Quản lý kho',
    url: {
      name: 'inventories-list',
    },
    category: 'dashboards',
  },
  
]


// ** GET Search Data
// eslint-disable-next-line sonarjs/cognitive-complexity
mock.onGet('/app-bar/search').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const exactData = {
    dashboards: [],
    appsPages: [],
    userInterface: [],
    formsTables: [],
    chartsMisc: [],
  }

  const includeData = {
    dashboards: [],
    appsPages: [],
    userInterface: [],
    formsTables: [],
    chartsMisc: [],
  }

  database.forEach(obj => {
    const isMatched = obj.title.toLowerCase().startsWith(queryLowered)
    if (isMatched && exactData[obj.category].length < 5)
      exactData[obj.category].push(obj)
  })
  database.forEach(obj => {
    const isMatched = !obj.title.toLowerCase().startsWith(queryLowered) && obj.title.toLowerCase().includes(queryLowered)
    if (isMatched && includeData[obj.category].length < 5)
      includeData[obj.category].push(obj)
  })

  const categoriesCheck = []

  Object.keys(exactData).forEach(category => {
    if (exactData[category].length > 0)
      categoriesCheck.push(category)
  })
  if (categoriesCheck.length === 0) {
    Object.keys(includeData).forEach(category => {
      if (includeData[category].length > 0)
        categoriesCheck.push(category)
    })
  }
  const resultsLength = categoriesCheck.length === 1 ? 5 : 3
  const mergedData = []

  Object.keys(exactData).forEach(element => {
    if (exactData[element].length || includeData[element].length) {
      const r = exactData[element].concat(includeData[element]).slice(0, resultsLength)

      r.unshift({ header: element, title: element })
      mergedData.push(...r)
    }
  })
  
  return [200, [...mergedData]]
})
