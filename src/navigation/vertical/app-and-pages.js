export default [
  { heading: 'Quản lý' },
  {
    title: 'Quản lý thể loại',
    icon: { icon: 'tabler-category' },
    children: [
      { title: 'Danh sách', to: 'categories-list' },
      { title: 'Tạo mới', to: { name: 'categories-create' } },
    ],
  },
  {
    title: 'Quản lý người dùng',
    icon: { icon: 'tabler-user' },
    children: [
      { title: 'Danh sách', to: 'users-list' },
    ],
  },
  {
    title: 'Quản lý video',
    icon: { icon: 'tabler-video' },
    children: [
      { title: 'Danh sách', to: 'videos-list' },
      { title: 'Tạo mới', to: { name: 'videos-create' } },
      // { title: 'Chi tiết', to: { name: 'products-detail-id', params: { id: '1' } } },
      // { title: 'Sửa', to: { name: 'products-update-id', params: { id: '5036' } } },
    ],
  },
  {
    title: 'Quản lý livestream',
    icon: { icon: 'tabler-cast' },
    children: [
      { title: 'Danh sách', to: 'orders-list' },
    ],
  },
  // {
  //   title: 'Quản lý bài viết',
  //   icon: { icon: 'tabler-article' },
  //   children: [
  //     { title: 'Danh sách', to: 'posts-list' },
  //     { title: 'Tạo mới', to: { name: 'posts-create' } },
  //     // { title: 'Sửa', to: { name: 'posts-update-id', params: { id: '5036' } } },
  //   ],
  // },
  // {
  //   title: 'Quản lý banner',
  //   icon: { icon: 'tabler-ad-filled' },
  //   children: [
  //     { title: 'Danh sách', to: 'banners-list' },
  //     { title: 'Tạo mới', to: { name: 'banners-create' } },
  //   ],
  // },
  // {
  //   title: 'Quản lý chiến dịch',
  //   icon: { icon: 'tabler-link' },
  //   children: [
  //     { title: 'Danh sách', to: 'campaigns-list' },
  //   ],
  // },
  // {
  //   title: 'Quản lý sale',
  //   icon: { icon: 'tabler-discount-2' },
  //   // to: {name: 'sales-list'},
  //   children: [
  //     { title: 'Danh sách', to: 'sales-list' },
  //     { title: 'Tạo kịch bản sale', to: 'sales-campaign' },

  //   ],
  // },
  // {
  //   title: 'Quản lý kho',
  //   icon: { icon: 'tabler-building-warehouse' },
  //   to: {name: 'warehouse-tab', params: {tab: "inventory"}},
  // },
]
