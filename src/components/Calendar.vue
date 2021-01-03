<template>
  <v-app class="bgr">
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Institute of Earth Sciences </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title> Snattari</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="mr-4" @click="home">Home </v-btn>
      <v-btn icon><v-icon>mdi-export</v-icon></v-btn>
    </v-app-bar>
    <v-container>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn @click="addEvent" class="mr-4" color="primary"
                >Add Event</v-btn
              >
              <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
              >
                Today
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <!-- check if tTime is necessary -->
          <v-sheet height="600">
            <v-overlay :value="overlay" @click="overlay = false"></v-overlay>
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:time="tTime($event)"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @click:day="dayClick($event)"
            ></v-calendar>

            <!-- ---------------Selected item------------- -->
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :close-on-click="false"
              :activator="selectedElement"
              offset-x
              @click="myo"
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-btn icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-toolbar-title
                    class="ml-2 mt-1 text-caption"
                    v-html="selectedEvent.timerange"
                  ></v-toolbar-title>

                  <v-spacer></v-spacer>
                  <v-btn icon @click="deleteEvent(selectedEvent.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <form v-if="currentlyEditing !== selectedEvent.id">
                    {{ selectedEvent.details }}
                  </form>
                  <form v-else>
                    <textarea-autosize
                      v-model="selectedEvent.details"
                      type="text"
                      style="border:1px solid blue; width:100%"
                      :min-height="100"
                      placeholder="add note"
                    >
                    </textarea-autosize>
                  </form>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="secondary" @click="my">
                    Close
                  </v-btn>
                  <v-btn
                    text
                    v-if="currentlyEditing !== selectedEvent.id"
                    @click.prevent="editEvent(selectedEvent)"
                    >Edit</v-btn
                  >
                  <v-btn text v-else @click.prevent="updateEvent(selectedEvent)"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <!-- -----------------form modal --------------------------- -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="ma-5" max-width="458">
        <v-card-title><span class="headline">Event</span></v-card-title>
        <v-container>
          <v-form ref="form" @submit.prevent="submitEvent">
            <v-text-field
              type="text"
              v-model="reserve.name"
              required
              label="Name"
              class="mb-0 pb-0"
            ></v-text-field>
            <p class="errorMessages " v-if="!nameIsValid">
              Name required
            </p>
            <v-text-field
              required
              label="Day"
              type="date"
              v-model="reserve.date"
            ></v-text-field>
            <p class="errorMessages " v-if="!dateIsValid">
              Date required
            </p>
            <v-row class="time mt-2">
              <div class="mx-3 mt-6 v-label theme--light">
                Start:
              </div>
              <div>
                <vue-timepicker
                  required
                  class="mt-4"
                  v-model="startTime"
                  input-width="7em"
                  :minute-interval="15"
                  drop-direction="auto"
                  close-on-complete
                ></vue-timepicker>
                <p class="errorMessages mt-2 " v-if="!startIsValid">
                  Start required
                </p>
              </div>
              <div class="mx-3 mt-6 v-label theme--light">
                End:
              </div>
              <div>
                <vue-timepicker
                  class="mt-4"
                  v-model="endTime"
                  input-width="7em"
                  :minute-interval="15"
                  drop-direction="auto"
                  close-on-complete
                ></vue-timepicker>
                <p class="errorMessages mt-2 " v-if="!endIsValid">
                  End required
                </p>
              </div>
            </v-row>
            <v-text-field
              v-model="reserve.details"
              label="Details"
              type="text"
              hint="if relevant"
              persistent-hint
            ></v-text-field>

            <v-btn
              :disabled="!formIsValid"
              type="submit"
              class="mr-4 mt-4"
              @click.stop="dialog = false"
            >
              submit
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    overlay: false,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    regex: /\d{2}:\d{2}/,
    startTime: "",
    endTime: "",
    reserve: {
      name: "",
      details: "",
      date: null,
      start: "",
      end: "",
      color: "#197602",
      tStamp: null
    },
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    events: [],
    dialog: false
  }),
  mounted() {
    this.getData()
    this.$refs.calendar.checkChange(), this.setToday()
  },
  computed: {
    nameIsValid() {
      return !!this.reserve.name
    },
    startIsValid() {
      return this.regex.test(this.startTime)
    },
    endIsValid() {
      return this.regex.test(this.endTime) && this.startTime < this.endTime
    },
    dateIsValid() {
      return !!this.reserve.date
    },
    formIsValid() {
      return (
        this.nameIsValid &&
        this.startIsValid &&
        this.endIsValid &&
        this.dateIsValid
      )
    }
  },

  methods: {
    my() {
      this.selectedOpen = false
      this.overlay = false
    },

    getData() {
      this.$http.get("getData.php").then(resp => {
        this.events = resp.data
      })
    },
    resetTimer() {
      this.startTime = "HH:mm"
      this.endTime = "HH:mm"
    },
    dayClick(e) {
      console.log(e)
      this.reserve.date = e.date
      this.addEvent()
    },
    home() {
      window.location.href = "http://google.com"
    },
    tTime(e) {
      console.log(e)
      console.log(this.selectedOpen)
      console.log("in time")

      //if selectedOpen is true do nothing  else open input dialog
      if (!this.selectedOpen) {
        // this.dialog = true
      }
    },
    viewDay({ date }) {
      this.focus = date
      this.type = "day"
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = "now"
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id
    },
    showEvent({ nativeEvent, event }) {
      console.log("one")
      const open = () => {
        this.selectedEvent = event
        console.log("two")
        this.selectedElement = nativeEvent.target

        setTimeout(() => {
          this.selectedOpen = true
          console.log("three")
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      console.log("ee")
      console.log(this.selectedOpen)
      nativeEvent.stopPropagation()
    },
    addEvent() {
      this.dialog = true
    },
    submitEvent() {
      let obj = {
        name: this.reserve.name,
        start: this.reserve.date + " " + this.startTime,
        end: this.reserve.date + " " + this.endTime,
        color: this.colors[Math.floor(Math.random() * 7)],
        details: this.reserve.details,
        tStamp: new Date().getTime(),
        timeRange: this.startTime + "-" + this.endTime
      }

      this.$http
        .post("postData.php", obj)
        .then(this.events.push(obj), this.$refs.form.reset(), this.resetTimer())
    }
  }
}
</script>

<style lang="scss">
.v-messages,
.v-text-field__details {
  height: 0px !important;
  min-height: 0px !important;
}
.errorMessages {
  color: red;
  font-size: 10px;
}
.time {
  height: 66px;
}
.bgr {
  background-color: grey;
}
</style>
