<template>
    <div id="note-entry-component">
      <div class="textEntryContainer">
        <h5 class="label">Focus</h5>
        <div class="inputs">

          <input 
            id="testFocusInput"
            type="text" 
            placeholder="Enter Test Session Focus" 
            autofocus
            v-model="testFocusText" 
            v-on:input="handleFocusChange" 
            :class="{'redBorder': this.testFocusStatus===-1, 
                     'greenBorder': this.testFocusStatus===0, 
                     'orangeBorder': this.testFocusStatus===1}" />
          <div id="saveFocusButton" class="notes-button green" @click="saveFocus" :class="{'disabled-button': this.testFocusStatus<=0}" >Save</div>
        </div>
      </div>
      <div class="noteListContainer">
        <div id="noteContainer" v-for="note in this.notes">
                <p id="noteTimestamp">
                  {{new Intl.DateTimeFormat('default', {timeStyle: 'short'}).format(note.timestamp.toDate())}}
                </p>
                <p id="noteText">
                  {{note.text}}
                </p>
            </div>
      </div>
      <div class="textEntryContainer">
        <input v-model="message" placeholder="Enter Your Note" />
        <div id="saveNoteButton" class="notes-button green" :class="{'disabled-button': this.message.trim().length<=0}" @click="saveNote">Add Note</div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    notes: {
      type: Array
    },
    testFocus: {
      type: String
    }
  },
  data() {
    return {
      message: "",
      testFocusText: this.testFocus,
      currentFocus: this.testFocus,
      testFocusStatus: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.handleFocusChange(null);
    });

  },
  methods: {
    saveFocus() {
      if (this.testFocusText.trim().length>0 && this.testFocusStatus===1) {
        // send new focus text to TestSession component, which will handle DB saving
        this.$emit("saveFocus", this.testFocusText);
        setTimeout(() => {
          this.testFocusText=this.testFocus;
        }, 500);
        this.currentFocus=this.testFocusText;
        this.handleFocusChange(null);
      }
    },
    saveNote(){
      if (this.message.trim().length>0)
      { // emit new note to TestSession component which will handle saving the note
        this.$emit("saveNote", this.message);
        this.message = '';
      }
    },
    handleFocusChange(e) {

      // set status according to comparison of current test focus (from DB) and updated test focus (from text field)

      // currentFocus is from the DB
      // testFocusText is from the input field

      // only allow updates (status 1) if current is different than new, and new isn't empty
      // disable updates (status -1 for error: cannot save, and 0 for no changes needed: current is same as saved) otherwise

      if (this.currentFocus==='' || this.currentFocus===null) {
        if (this.testFocusText.trim()==='') {
          this.testFocusStatus=-1;
        } else {
          this.testFocusStatus=1;
        }
      } else if (this.currentFocus.trim()===this.testFocusText.trim()) {
        this.testFocusStatus=0;
      } else {
        this.testFocusStatus=1;
      }
    }
	},
  watch: {
    testFocus: (newVal, oldVal) => {
      this.currentFocus=newVal;
      this.testFocusStatus=0;
    }
  }
}
</script>

<style scoped>


#note-entry-component {
  padding: 10px;
  border: 2px solid grey;
  border-radius: 5px;
}
.white-text {
  color: #FC7727;
}

#saveFocusButton {
  width: 50px;
  margin-top: auto;
  margin-bottom: auto;
}

.textEntryContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  max-width: 400px;
  min-width: 180px;
}

.label {
  align-content: center;
  align-items: center;
  width: 50px;
  margin-right: 5px;
  margin-top: auto;
  margin-bottom: auto;
}

.inputs {
  display: flex;
  flex-direction: row;
  justify-content: right;
}

#noteContainer {
  padding: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
  background-color: lightgray;
}

#noteContainer:last-child {
  padding: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  border: none;
  background-color: lightgray;
}

.noteListContainer {
  margin-top: 10px;
  height: 50%;
  overflow: scroll;
  border: 1px solid black;
  border-radius: 5px;
  margin-bottom: 10px;
}


#noteTimestamp {
  width: 30%;
  font-size: 10px;
  color: gray;
  margin-top: 0px;
}

#noteText {
  width: 70%;
  margin-top: auto;
  margin-bottom: auto;
}

.green {
  background-color: green;
}

.close-button {
    width: 93.08px;
    height: 28px;
    background: #666464;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 5px;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;
    text-align: center;
    color: #C4C2C2;
    cursor: pointer;
}

.disabled-button {
  cursor: not-allowed !important;
  background-color: #8b8b8b !important;
}

input {
  margin-bottom: 0px;
  outline: none;
}

.redBorder {
  border: 2px solid red;
}

.orangeBorder {
  border: 2px solid orange;
}

.greenBorder {
  border: 2px solid green;
}

</style>