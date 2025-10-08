import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["password", "eyeIcon", "eyeSlashIcon"]

  connect() {
    console.log("New Session Controller connected")
  }

  togglePassword() {
    try {
      if (this.passwordTarget.type === "password") {
        this.passwordTarget.type = "text"
        this.eyeIconTarget.style.display = "none"
        this.eyeSlashIconTarget.style.display = "inline"
      } else {
        this.passwordTarget.type = "password"
        this.eyeIconTarget.style.display = "inline"
        this.eyeSlashIconTarget.style.display = "none"
      }
    } catch (error) {
      console.error("Error toggling password visibility:", error)
    }
  }
}
