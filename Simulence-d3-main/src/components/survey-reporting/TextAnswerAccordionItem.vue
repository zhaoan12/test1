<!-- A sub-component for individual items of an accordion. Because of how bootstrap works this component doesn't make sense to render on its own! -->

<script>

export default {
  props: {
    questionNumber: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    startExpanded: {
      type: Boolean,
      default: false
    },
    userAnswer: {
      type: String,
      required: true,
    }
  },
}
</script>

<template>
  <!-- The same component -- except one is open, and one is not, dependent on whether startExpanded is true -->
  <div v-if="startExpanded" class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#answer_${userId.replace(' ', '_')}_${questionNumber}`"
              :aria-expanded="startExpanded.toString()" :aria-controls="`answer_${userId.replace(' ', '_')}_${questionNumber}`">
        User: {{userId}}
      </button>
    </h2>
    <div :id="`answer_${userId.replace(' ', '_')}_${questionNumber}`" class="accordion-collapse collapse show" :data-bs-parent="`#user_${userId.replace(' ', '_')}_question_${questionNumber}_accordion`">
      <div class="accordion-body">
        {{userAnswer}}
      </div>
    </div>
  </div>
  <div v-else class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#answer_${userId.replace(' ', '_')}_${questionNumber}`"
              :aria-expanded="startExpanded.toString()" :aria-controls="`answer_${userId.replace(' ', '_')}_${questionNumber}`">
        User: {{userId}}
      </button>
    </h2>
    <div :id="`answer_${userId.replace(' ', '_')}_${questionNumber}`" class="accordion-collapse collapse" :data-bs-parent="`#user_${userId.replace(' ', '_')}_question_${questionNumber}_accordion`">
      <div class="accordion-body">
        {{userAnswer}}
      </div>
    </div>
  </div>
</template>

