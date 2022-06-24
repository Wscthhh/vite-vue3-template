<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()

const add = () => {
  store.commit('ADD_COUNT')
}
</script>
<template>
  <div class="home">home</div>
  <div>
    <button @click="add">count:</button>
    <span>{{ store.state.count }}</span>
  </div>
</template>
<style lang="less" scoped>
.home {
  color: bisque;
}
</style>
