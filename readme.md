# User Registration NodeJS Project
### Summary
Registration API to handle registration function

#### Prerequests:
-NodeJS
-Express
-MySQL

#### User Stories:
1. [x] Accept a POST request to path "/register"
2. [x] Expect to receive data of a JSON object containing the following information of a user
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
3. [x] Securely hash the Password for storage
4. [x] Allow user to upload a profile picture via path "/uploadProfile"
5. [x] Enforce necessary data validation and proper errors should be returned
6. [x] Return a success message if all validations are passed
7. [x] Store information in a local database, preferably, MySQL
Requirements
8. [x] Accept input and return output in JSON

