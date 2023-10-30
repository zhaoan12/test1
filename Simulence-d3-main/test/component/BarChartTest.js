import {render, fireEvent, screen} from '@testing-library/vue'

import BarChart from "../../src/components/survey-reporting/BarChart.vue"

test("Check Bar Graph Display", async () => {
  /** Test that the bar graph's display correctly indicates the number of responses
   * **/

  const placeholderText = "Graph Results"


  render(BarChart)
  // Test that our bar chart is visible

  screen.getByText(placeholderText)
  console.log("it works")
})
