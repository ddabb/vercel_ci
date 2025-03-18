<template>
  <header>
    <h1>古诗文网</h1>
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/dynasties">朝代列表</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header'
};
</script>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
}
</style>