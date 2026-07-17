Feature: Cinema List management
  As an Admin user
  I want to view and manage the Cinema List
  So that I can see scheduled shows and navigate to show details

  Background:
    Given the Cinema Scheduler application is available
    And I am logged in as Admin
    And I am on the Cinema List tab

  @cinema_list @DONE
  Scenario: Empty state shows no scheduled cinema shows message
    Given there are no cinema shows scheduled
    When I open the Cinema List tab
    Then I should see "No cinema shows scheduled yet"

  @cinema_list @DONE
  Scenario: New Show button navigates to the Details tab
    When I click the New Show button
    Then I should be on the Details tab

  @cinema_list @negative @DONE
  Scenario: Export button is disabled when no shows exist
    Given there are no scheduled cinema shows
    When I view the Cinema List tab
    Then the Export button should be disabled

  @cinema_list @DONE
  Scenario: Cinema List tab displays header in a table
    Then I should see a table with columns:
      | Schedule ID | Movie Title | Theater | Show Date | Show Time | Subtitles | IMAX | Notes |

  @cinema_list @DONE
  Scenario: Pagination displays 10 records per page with navigation controls
    Given there are more than 11 scheduled cinema shows
    When I view the Cinema List tab
    Then I should see 10 records on the current page
    And I should see pagination navigation controls
    And I should see text matching "Page 1 of" and "total records"

  @cinema_list
  Scenario: Sort columns by Schedule ID, Movie Title, Theater, and Show Date
    When I sort the table by "Schedule ID" ascending
    Then the table should display Schedule IDs in ascending order
    When I sort the table by "Movie Title" descending
    Then the table should display Movie Titles in descending order
    When I sort the table by "Theater" ascending
    Then the table should display Theaters in ascending order
    When I sort the table by "Show Date" descending
    Then the table should display Show Dates in descending order

  @cinema_list @DONE
  Scenario: Export button downloads all records when shows exist
    Given there is at least one scheduled cinema show
    When I click the Export button
    Then the file "cinemalist.csv" should be downloaded
    And the export should include all records

  

 
