import {render, fireEvent, screen} from '@testing-library/vue'
import TextAccordion from "../../src/components/survey-reporting/TextAccordion.vue"

test("Check Accordion Expansion", async () => {
  // Test that a closed accordion item's text does not appear at the start -- but DOES appear after clicking

  //on the accordion item to expand it.*

  const closedButtonText = "User: Bill Cipher"
  const placeholderText = "I enjoyed rearranging the orifices on people's faces."

  render(TextAccordion)
  // Test that our accordion item content is invisible at the start...
  const hopefullyNull = screen.queryByText(placeholderText)
  expect(hopefullyNull).toBeNull()

  const unexpandedButton = screen.getByText(closedButtonText)
  await fireEvent.click(unexpandedButton)
  screen.getByText(placeholderText, {exact: false})
})

test("Check Accordion Collapse", async () => {
  // Test that an open accordion item's text does appear at the start -- but STOPS appearing after clicking

  //on the accordion item to collapse it.*
  //
  const closedButtonText = "User: Grunkle Stan"
  const placeholderText = "I really liked it, but I thought it could have used more crime and general evilness"

  render(TextAccordion)

  // Check that the open accordion item and its text are visible...
  const expandedButton = screen.getByText(closedButtonText)
  screen.getByText(placeholderText, {exact: false})

  await fireEvent.click(expandedButton)

  // Test that our accordion item content is now invisible...
  const hopefullyNull = screen.queryByText(placeholderText)
  expect(hopefullyNull).toBeNull()
})

// Looks like child elements are stubs.
// May need to register components.
// Switch the component over to the Options API and then see.
// Make sure to register stuff.
