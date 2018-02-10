/**
 * Copyright 2018 ThinxNet GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './assets/styles.css';

import Vue from 'vue';

import Store from './store';
import Router from './router';

Vue.http.interceptors.push((request, next) => {
  const token = Store.getters['authentication/authToken'];
  if (token) {
    request.headers.set('X-Txn-Auth-Token', token);
  }
  request.headers.set('Content-Language', Store.getters['common/locale']);
  next();
});

Router.beforeEach((to, from, next) => {
  return (to.name !== 'login' && !Store.getters['authentication/isAuthenticated'])
    ? next({path: '/login', query: {redirect: to.fullPath}})
    : next();
});

import ComponentsApp from './components/App.vue';

new Vue({
  el: '#app',
  render: h => h(ComponentsApp),
  router: Router,
  store: Store
});
