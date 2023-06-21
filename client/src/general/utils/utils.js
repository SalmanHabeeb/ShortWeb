import { verifyLogin } from "../../lib";
import Cookies from "js-cookie";

export async function isLoggedIn() {
  // Check if the sessionStorage has the key isLoggedIn
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    // If yes, return true
    if (Cookies.get("isLoggedIn")) {
      return true;
    } else {
      sessionStorage.removeItem("isLoggedIn");
      return false;
    }
  } else {
    if (Cookies.get("isLoggedIn")) {
      // If not, use verifyLogin() to check if the user is logged in
      const result = await verifyLogin();
      console.log(result);
      // If the result is true, set the sessionStorage key isLoggedIn to "true"
      if (result.data.loggedIn) {
        sessionStorage.setItem("isLoggedIn", "true");
        return true;
      }
    }
    return false;
  }
}
