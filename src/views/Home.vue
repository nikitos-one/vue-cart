<template>
  <div id="app">
    <app-container/>
  </div>
</template>

<script>
  import appContainer from "../components/appContainer";

  export default {
    name: 'Home',
    components: {
      appContainer,
    }
  }
</script>