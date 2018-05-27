#User Registration NodeJS Project
## Summary
Registration API to handle registration function

###Prerequests:
-NodeJS
-Express
-MySQL

### User Stories:
[x] Accept a POST request to path "/register"
[x] Expect to receive data of a JSON object containing the following information of a user
- Email,
- First Name
- Last Name
- Password
- Gender
- Date of Birth
- Zipcode
- Height
- Gender Preference
- Age Preference Min
- Age Preference Max
- Race (optional)
- Religion (optional)
[x] Securely hash the Password for storage
[x] Allow user to upload a profile picture via path "/uploadProfile"
[x] Enforce necessary data validation and proper errors should be returned
[x] Return a success message if all validations are passed
[x] Store information in a local database, preferably, MySQL
Requirements
[x] Accept input and return output in JSON

