<template>
  <div id="navbar-menu" :class="['navbar-menu', {'is-active': isActive}]">
    <div class="navbar-end">
      <router-link class="navbar-item" active-class="is-active"
        :to="{name}" v-for="(name, idx) in ['dashboard', 'feedback']" :key="idx">
        {{ $_.upperFirst(name) }}
      </router-link>
      <a @click.prevent="logout" class="navbar-item">Log-out</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'navbar-menu',
    props: {isActive: {default: false, type: Boolean}},
    methods: {
      logout() {
        this.$store.dispatch('authentication/logout');
      }
    }
  };
</script>
