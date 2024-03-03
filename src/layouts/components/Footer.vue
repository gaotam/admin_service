<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      
      <VIcon
        icon="tabler-heart"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      <a
        href="https://www.facebook.com/mynamebvh"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >HoangBui</a>
    </span>
  </div>
</template>
