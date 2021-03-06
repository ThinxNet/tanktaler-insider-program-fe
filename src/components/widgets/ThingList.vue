<template>
  <article class="tile is-child">
    <div v-if="loading" class="has-text-centered has-text-white">
      <span class="icon is-large is-radiusless box"><i class="ion-ios-time"></i></span>
      loading&hellip;
    </div>

    <div v-else class="columns is-radiusless is-flex is-gapless">
      <div class="column is-10 has-text-centered">
        <div class="media" v-if="currentThing">
          <div class="media-content">
            <b class="is-size-4 has-text-white">{{currentThing.nickName}}</b>
            <span v-if="currentThing.ymme" class="has-text-light">
             <span class="has-text-primary is-size-5">|</span>
             {{currentThing.ymme.year}} {{currentThing.ymme.make}} {{currentThing.ymme.model}}
            </span>
          </div>
        </div>
      </div>
      <div class="column has-text-right">
        <button class="button is-white is-radiusless"
          v-if="hasMultipleThings" :disabled="!hasPreviousThing"
          @click.prevent="previousThing">
          <span class="icon"><i class="ion-ios-arrow-back"></i></span>
        </button>
        <button class="button is-primary is-radiusless" @click.prevent="thingOverviewToggle">
          <span class="icon"><i class="ion-ios-wifi"></i></span>
        </button>
        <button class="button is-white is-radiusless"
          v-if="hasMultipleThings" :disabled="!hasNextThing" @click.prevent="nextThing">
          <span class="icon"><i class="ion-ios-arrow-forward"></i></span>
        </button>
      </div>
    </div>

    <div class="modal is-active" style="z-index: 1001"
      v-if="uiThingOverview" ref="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head is-radiusless">
          <p class="modal-card-title">overview</p>
          <button class="delete" aria-label="close" @click.prevent="thingOverviewToggle"></button>
        </header>

        <section class="modal-card-body">
          <thing-details-overview :thing-id="currentThing._id"/>
        </section>
      </div>
    </div>
  </article>
</template>

<script>
  import _ from 'lodash';

  import ThingDetailsOverview from './thing-details/Overview';

  const LOCAL_STORAGE_IDX_KEY = 'widgetThingList_SelectedIdx';

  export default {
    name: 'widget-thing-list',
    data: () => ({
      api: null,
      entries: [],
      loading: true,
      selectedIdx: null,
      uiThingOverview: false
    }),
    components: {ThingDetailsOverview},
    created() {
      this.api = this.$store.getters['common/apiInsiderProgram'];
    },
    async mounted() {
      try {
        const response = await this.api.things({page: {size: 1}});
        this.entries = response.data.filter(e => e.device);
      } catch (e) {
        console.error(e);
        return;
      } finally {
        this.loading = false;
      }
      this.thingAutoSelect();
    },
    watch: {
      selectedIdx(selectedIdx) {
        this.$emit('onEntrySelected', this.currentThing);
        localStorage.setItem(LOCAL_STORAGE_IDX_KEY, selectedIdx);
      }
    },
    methods: {
      previousThing() {
        if (this.hasPreviousThing) {
          this.selectedIdx--;
        }
        return false;
      },
      nextThing() {
        if (this.hasNextThing) {
          this.selectedIdx++;
        }
        return false;
      },
      thingOverviewToggle() {
        this.uiThingOverview = !this.uiThingOverview;
      },
      thingAutoSelect() {
        if (!this.entries.length) { return false; }
        const selectedIdx = _.toSafeInteger(localStorage.getItem(LOCAL_STORAGE_IDX_KEY));
        this.selectedIdx = _.inRange(selectedIdx, 0, this.entries.length) ? selectedIdx : 0;
      }
    },
    computed: {
      currentThing() {
        return this.entries[this.selectedIdx];
      },
      hasMultipleThings() {
        return this.entries.length > 1;
      },
      hasNextThing() {
        return this.selectedIdx + 1 < this.entries.length;
      },
      hasPreviousThing() {
        return this.selectedIdx > 0;
      }
    }
  }
</script>
