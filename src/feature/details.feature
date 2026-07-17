Feature: Cinema show details form
  As an Admin user
  I want to create or edit cinema show details
  So that I can schedule cinema shows correctly

  Background:
    Given the Cinema Scheduler application is available
    And I am logged in as Admin
    And I am on the Details tab

  @details @DONE
  Scenario: Movie Title typeahead shows available movies in alphabetical order
    When I focus the Movie Title field
    Then I should see available movies in alphabetical order

  @details @DONE
  Scenario: Theater dropdown contains six theater options
    Then the Theater dropdown should contain 6 options

  @details @negative @DONE
  Scenario: Show Date accepts dd/mm/yyyy weekdays only
    When I enter Show Date "15/08/2026"
    Then the date field should accept the value
    When I enter Show Date "17/08/2026"
    Then the date field should show a validation error for "Show Date must be a weekday"
    When I enter Show Date "16/18/2026"
    Then the date field should show a validation error for "Invalid date"
    When I enter Show Date "30/02/2026"
    Then the date field should show a validation error for "Invalid date"
    When I enter Show Date "29/02/2026"
    Then the date field should show a validation error for "Invalid date"
    

  @details @negative @DONE
  Scenario: Show Time accepts HH:MM 24-hour format
    When I enter Show Time "14:30"
    Then the time field should accept the value
    When I enter Show Time ""
    Then the time field should show a validation error for "Show Time is required"
    When I enter Show Time "25:00"
    Then the time field should show a validation error for "Time must be HH:MM format"

  @details @negative @DONE
  Scenario: Ticket Price validation
    When I enter "0" as ticket price 
    Then the ticket price field should show a validation error for "Value must be greater than or equal to 0"
    When I enter "-1" as ticket price 
    Then the ticket price field should show a validation error for "Ticket Price must be a valid positive number"

  @details @DONE
  Scenario: Ticket Price calculates discounts automatically
    When I enter "100" as ticket price 
    Then the Ticket Price for student should reflect a 30% discount
    And the Ticket Price for senior should reflect a 60% discount

  @details @DONE
  Scenario: End Date automatically calculates as Show Date plus 7 days
    When I enter Show Date "01/10/2026"
    Then the End Date should be "08/10/2026"

  @details @DONE
  Scenario: Notes field is limited to 50 characters
    When I enter a 51 character note
    Then the notes should not accept the 51st character

  @details @DONE
  Scenario: Form buttons display in order Save, Reset, Back with correct colors
    Then I should see buttons in order: Save (blue), Reset (gray), Back (gray)

  @details @DONE
  Scenario: Back button navigates back to the Cinema List tab
    When I click the Back button
    Then I should be on the Cinema List tab

  @details @DONE
  Scenario: Reset button clears all Details form fields
    When I enter all required fields
    And I click Reset
    Then all Details form fields should be cleared

  @details @negative @DONE
  Scenario: Duplicate show is prevented for same theater, movie, date, and time
    Given a cinema show exists with theater "Theater 1", movie "Movie A", Show Date "01/09/2026", Show Time "18:00"
    When I enter the same theater, movie, date, and time
    And I click Save
    Then I should see an error banner stating the show is duplicate
    And the duplicate show should not be saved

  @details @DONE
  Scenario: Saved show appears in Cinema List with auto-generated Schedule ID and success banner
    When I complete all required fields with valid show details
    And I click Save
    Then I should see a success banner with "Cinema show saved successfully!"
    And the new show should appear in the Cinema List table
    And the new show should display an auto-generated Schedule ID
