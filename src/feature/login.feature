Feature: Admin login
  As an Admin user
  I want to authenticate into the Cinema Scheduler application
  So that I can access the Cinema List dashboard

  Background:
    Given the Cinema Scheduler application is available

  @login @DONE
  Scenario: Successful login redirects to Cinema List dashboard
    Given I am on the login page
    When I enter username "Admin" and password "password"
    And I submit the login form
    Then I should be redirected to the Cinema List dashboard
    And I should see a welcome message

  @login @negative @DONE
  Scenario Outline: Invalid login credentials show an error message
    Given I am on the login page
    When I enter username "<username>" and password "<password>"
    And I submit the login form
    Then I should remain on the login page
    And I should see an error message

    Examples:
      | username | password   |
      | Admin    | wrongpass  |
      | wrong    | password   |
      |          | password   |
      | Admin    |           |
