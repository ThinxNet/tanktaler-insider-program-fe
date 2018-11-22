<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-vertical">
      <div class="tile is-parent is-vertical" v-if="notification">
        <div class="notification is-warning is-radiusless">{{ notification }}</div>
      </div>

      <div class="tile is-parent">
        <widget-thing-list @onEntrySelected="thingChange"/>
      </div>

      <div class="tile" v-if="thing">
        <!-- last session -->
        <div class="tile is-parent is-4" style="background-color: #14ADDD">
          <widget-thing-session-list
            :session-id="sessionId"
            :device-id="thing.device"
            @onSessionChange="thingSessionListChange"/>
        </div>

        <div class="tile is-vertical">
          <div class="tile">
            <!-- session details -->
            <div class="tile is-parent" style="background-color: #14ADDD">
              <widget-thing-session-details :session-id="sessionId"/>
            </div>

            <!-- activity -->
            <div class="tile is-parent">
              <widget-thing-activity :thing-id="thing._id"/>
            </div>
          </div>

          <div class="tile">
            <!-- timeline -->
            <div v-if="sessionId" class="tile is-parent" style="background-color: #14ADDD">
              <widget-thing-session-safety :session-id="sessionId"/>
            </div>

            <!-- device confidence -->
            <div class="tile is-parent">
              <widget-device-confidence :thing-id="thing._id"/>
            </div>
          </div>
        </div>
      </div>

      <div class="tile">
          <div v-if="sessionId" class="tile is-parent is-8" style="background-color: #14ADDD">
            <widget-thing-session-timeline :session-id="sessionId"/>
          </div>
        <div class="tile is-4">

        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import WidgetDeviceConfidence from '../widgets/DeviceConfidence';
  import WidgetThingActivity from '../widgets/ThingActivity';
  import WidgetThingList from '../widgets/ThingList';
  import WidgetThingSessionDetails from '../widgets/ThingSessionDetails';
  import WidgetThingSessionList from '../widgets/ThingSessionList';
  import WidgetThingSessionSafety from '../widgets/ThingSessionSafety'
  import WidgetThingSessionTimeline from '../widgets/ThingSessionTimeline'

  export default {
    name: 'dashboard',
    data: () => ({thing: null, sessionId: null}),
    components: {
      WidgetDeviceConfidence, WidgetThingActivity, WidgetThingList, WidgetThingSessionDetails,
      WidgetThingSessionList, WidgetThingSessionSafety, WidgetThingSessionTimeline
    },
    created() {
      this.$watch(
        () => this.$store.getters["componentDashboard/sessionId"],
        newId => this.sessionId = newId
      );
    },
    beforeDestroy() {
      this.$store.dispatch('componentDashboard/sessionIdReset');
    },
    methods: {
      thingChange(thing) {
        this.thing = thing;
      },
      thingSessionListChange(sessionId) {
        this.$store.dispatch('componentDashboard/sessionIdChange', {sessionId});
      }
    },
    computed: {
      notification() {
        return (process.env.NODE_ENV === 'production')
          ? `The information comes from unreliable server infrastructure. Some trips might be ` +
            `missing or have less than 50% of real data. Having the mentioned limitations, ` +
            `please consider these results only for concept-demonstration purposes.`
          : null;
      },
      identity() {
        return JSON.stringify(this.$store.state.authentication.identity);
      }
    }
  }
</script>