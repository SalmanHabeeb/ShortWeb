export function displayInvalidEmailMessage() {
  alert("This email is not valid. Please enter a valid email address.");
}

export function displayUserNotExistsMessage() {
  alert("User not found. Please register or use a different email address.");
}

export function displayNotAuthorizedMessage() {
  alert("Not authorized. You do not have permission to access this resource.");
}

export function displayClientErrorMessage() {
  alert(
    "Something went wrong. Check your internet connection and try again later."
  );
}

export function displayServerErrorMessage() {
  alert("Server is experiencing difficulties. Please try again later.");
}

export function displayInvalidUserMessage() {
  alert("You are not logged in. Clear site data and login again.");
}

export function displayUserExistsMessage() {
  alert(
    "This email is already registered. Please log in or use a different email."
  );
}

export function displayPasswordNotMatchMessage() {
  alert("Incorrect password. Please check your password and try again.");
}

export function displayInvalidNewPasswordMessage() {
  alert(
    "New Password doesn't meet the criteria(atleast one lowercase charecter, one uppercase charecter, and one digit, with minimum length of 8)"
  );
}

export function displayInvalidURLMessage() {
  alert("The url you have input is invalid");
}
