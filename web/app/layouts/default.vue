<template>
  <div>
    <div class="with-tabs">
      <slot />
    </div>
    <TabBar />
  </div>
</template>

<style scoped>
/* Room for the fixed tab bar. */
.with-tabs { padding-bottom: calc(68px + env(safe-area-inset-bottom)); }
</style>
