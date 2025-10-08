import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["recipient", "badge", "message", "recipientError", "badgeError", "messageError", "submitButton"]

  connect() {
    console.log("Recognition Controller connected")
    this.setupValidation()
  }

  setupValidation() {
    try {
      // Add event listeners for real-time validation
      if (this.hasRecipientTarget) {
        this.recipientTarget.addEventListener('change', () => this.validateRecipient())
      }
      
      if (this.hasBadgeTarget) {
        this.badgeTarget.addEventListener('change', () => this.validateBadge())
      }
      
      if (this.hasMessageTarget) {
        this.messageTarget.addEventListener('blur', () => this.validateMessage())
        this.messageTarget.addEventListener('input', () => this.clearMessageError())
      }
    } catch (error) {
      console.error("Error setting up validation:", error)
    }
  }

  validateRecipient() {
    try {
      const recipient = this.recipientTarget.value
      
      if (!recipient || recipient === '') {
        this.showRecipientError("Please select a recipient")
        return false
      } else {
        this.clearRecipientError()
        return true
      }
    } catch (error) {
      console.error("Error validating recipient:", error)
      return false
    }
  }

  validateBadge() {
    try {
      const badge = this.badgeTarget.value
      
      if (!badge || badge === '') {
        this.showBadgeError("Please select a badge")
        return false
      } else {
        this.clearBadgeError()
        return true
      }
    } catch (error) {
      console.error("Error validating badge:", error)
      return false
    }
  }

  validateMessage() {
    try {
      const message = this.messageTarget.value.trim()
      
      if (!message) {
        this.showMessageError("Message is required")
        return false
      } else if (message.length < 10) {
        this.showMessageError("Message must be at least 10 characters long")
        return false
      } else if (message.length > 500) {
        this.showMessageError("Message must be less than 500 characters")
        return false
      } else {
        this.clearMessageError()
        return true
      }
    } catch (error) {
      console.error("Error validating message:", error)
      return false
    }
  }

  showRecipientError(message) {
    try {
      if (this.hasRecipientErrorTarget) {
        this.recipientErrorTarget.textContent = message
        this.recipientErrorTarget.style.display = "block"
        this.recipientTarget.classList.add('is-invalid')
      }
    } catch (error) {
      console.error("Error showing recipient error:", error)
    }
  }

  clearRecipientError() {
    try {
      if (this.hasRecipientErrorTarget) {
        this.recipientErrorTarget.style.display = "none"
        this.recipientTarget.classList.remove('is-invalid')
      }
    } catch (error) {
      console.error("Error clearing recipient error:", error)
    }
  }

  showBadgeError(message) {
    try {
      if (this.hasBadgeErrorTarget) {
        this.badgeErrorTarget.textContent = message
        this.badgeErrorTarget.style.display = "block"
        this.badgeTarget.classList.add('is-invalid')
      }
    } catch (error) {
      console.error("Error showing badge error:", error)
    }
  }

  clearBadgeError() {
    try {
      if (this.hasBadgeErrorTarget) {
        this.badgeErrorTarget.style.display = "none"
        this.badgeTarget.classList.remove('is-invalid')
      }
    } catch (error) {
      console.error("Error clearing badge error:", error)
    }
  }

  showMessageError(message) {
    try {
      if (this.hasMessageErrorTarget) {
        this.messageErrorTarget.textContent = message
        this.messageErrorTarget.style.display = "block"
        this.messageTarget.classList.add('is-invalid')
      }
    } catch (error) {
      console.error("Error showing message error:", error)
    }
  }

  clearMessageError() {
    try {
      if (this.hasMessageErrorTarget) {
        this.messageErrorTarget.style.display = "none"
        this.messageTarget.classList.remove('is-invalid')
      }
    } catch (error) {
      console.error("Error clearing message error:", error)
    }
  }

  validateForm(event) {
    try {
      const isRecipientValid = this.validateRecipient()
      const isBadgeValid = this.validateBadge()
      const isMessageValid = this.validateMessage()
      
      if (!isRecipientValid || !isBadgeValid || !isMessageValid) {
        event.preventDefault()
        return false
      }
      
      return true
    } catch (error) {
      console.error("Error validating form:", error)
      event.preventDefault()
      return false
    }
  }
}
