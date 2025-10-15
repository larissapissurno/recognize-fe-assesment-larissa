import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
	static targets = [
		"recipient",
		"badge",
		"message",
		"recipientError",
		"badgeError",
		"messageError",
		"submitButton",
		"charCount",
		"form",
		"modal",
	];

	static values = {
		maxLength: { type: Number, default: 500 },
	};

	connect() {
		console.log("Recognition Controller connected");
		this.setupValidation();
		this.setupModalEvents();
	}

	// Modal event listeners
	setupModalEvents() {
		try {
			if (this.hasModalTarget) {
				const modalElement = this.modalTarget;

				// Bootstrap modal events
				modalElement.addEventListener("shown.bs.modal", () => {
					this.onModalShown();
				});

				modalElement.addEventListener("hidden.bs.modal", () => {
					this.onModalHidden();
				});
			}
		} catch (error) {
			console.error("Error setting up modal events:", error);
		}
	}

	// Handle modal shown event
	onModalShown() {
		try {
			// Focus first field for better UX
			if (this.hasRecipientTarget) {
				this.recipientTarget.focus();
			}

			// Reset form if needed
			this.clearAllErrors();

			// Initialize character count
			this.updateCharCount();
		} catch (error) {
			console.error("Error in onModalShown:", error);
		}
	}

	// Handle modal hidden event
	onModalHidden() {
		try {
			// Reset form when modal closes
			this.resetForm();
		} catch (error) {
			console.error("Error in onModalHidden:", error);
		}
	}

	// Close modal programmatically
	closeModal() {
		try {
			if (this.hasModalTarget) {
				const modal = bootstrap.Modal.getInstance(this.modalTarget);
				if (modal) {
					modal.hide();
				}
			}
		} catch (error) {
			console.error("Error closing modal:", error);
		}
	}

	// Update character count
	updateCharCount() {
		try {
			if (this.hasMessageTarget && this.hasCharCountTarget) {
				const currentLength = this.messageTarget.value.length;
				this.charCountTarget.textContent = `${currentLength}/${this.maxLengthValue}`;

				// Change color as it approaches limit
				if (currentLength > this.maxLengthValue * 0.9) {
					this.charCountTarget.classList.add("text-danger");
					this.charCountTarget.classList.remove("text-muted");
				} else {
					this.charCountTarget.classList.remove("text-danger");
					this.charCountTarget.classList.add("text-muted");
				}
			}
		} catch (error) {
			console.error("Error updating character count:", error);
		}
	}

	// Handle Turbo submit end event
	handleSubmitEnd(event) {
		try {
			if (event.detail.success) {
				// Form submitted successfully
				this.onSubmitSuccess();
			} else {
				// Form had errors
				this.enableSubmitButton();
			}
		} catch (error) {
			console.error("Error handling submit end:", error);
		}
	}

	// Handle successful submission
	onSubmitSuccess() {
		try {
			// Close the modal
			this.closeModal();

			// Reset form
			this.resetForm();

			// Enable button
			this.enableSubmitButton();

			// Show success toast
			this.showSuccessToast("Recognition sent successfully! 🎉");
		} catch (error) {
			console.error("Error handling success:", error);
		}
	}

	// Reset form to initial state
	resetForm() {
		try {
			if (this.hasFormTarget) {
				this.formTarget.reset();
			}

			this.clearAllErrors();
			this.enableSubmitButton();

			if (this.hasCharCountTarget) {
				this.charCountTarget.textContent = `0/${this.maxLengthValue}`;
				this.charCountTarget.classList.remove("text-danger");
				this.charCountTarget.classList.add("text-muted");
			}
		} catch (error) {
			console.error("Error resetting form:", error);
		}
	}

	// Clear all validation errors
	clearAllErrors() {
		try {
			this.clearRecipientError();
			this.clearBadgeError();
			this.clearMessageError();
		} catch (error) {
			console.error("Error clearing all errors:", error);
		}
	}

	// Disable submit button
	disableSubmitButton() {
		try {
			if (this.hasSubmitButtonTarget) {
				this.submitButtonTarget.disabled = true;
				this.submitButtonTarget.innerHTML = `
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Sending...
        `;
			}
		} catch (error) {
			console.error("Error disabling button:", error);
		}
	}

	// Enable submit button
	enableSubmitButton() {
		try {
			if (this.hasSubmitButtonTarget) {
				this.submitButtonTarget.disabled = false;
				this.submitButtonTarget.innerHTML = `
          <i class="ph ph-paper-plane-tilt me-2"></i>
          Send Recognition
        `;
			}
		} catch (error) {
			console.error("Error enabling button:", error);
		}
	}

	// Show success toast
	showSuccessToast(message) {
		try {
			const toastContainer = document.getElementById("toast-container");
			if (!toastContainer) return;

			const toastHTML = `
        <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">
              <i class="ph ph-check-circle me-2"></i>
              ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      `;

			toastContainer.insertAdjacentHTML("beforeend", toastHTML);
			const toastElement = toastContainer.lastElementChild;
			const toast = new bootstrap.Toast(toastElement);
			toast.show();

			// Remove toast element after it's hidden
			toastElement.addEventListener("hidden.bs.toast", () => {
				toastElement.remove();
			});
		} catch (error) {
			console.error("Error showing toast:", error);
		}
	}

	setupValidation() {
		try {
			// Add event listeners for real-time validation
			if (this.hasRecipientTarget) {
				this.recipientTarget.addEventListener("change", () =>
					this.validateRecipient(),
				);
			}

			if (this.hasBadgeTarget) {
				this.badgeTarget.addEventListener("change", () => this.validateBadge());
			}

			if (this.hasMessageTarget) {
				this.messageTarget.addEventListener("blur", () =>
					this.validateMessage(),
				);
				this.messageTarget.addEventListener("input", () =>
					this.clearMessageError(),
				);
			}
		} catch (error) {
			console.error("Error setting up validation:", error);
		}
	}

	validateRecipient() {
		try {
			const recipient = this.recipientTarget.value;

			if (!recipient || recipient === "") {
				this.showRecipientError("Please select a recipient");
				return false;
			} else {
				this.clearRecipientError();
				return true;
			}
		} catch (error) {
			console.error("Error validating recipient:", error);
			return false;
		}
	}

	validateBadge() {
		try {
			const badge = this.badgeTarget.value;

			if (!badge || badge === "") {
				this.showBadgeError("Please select a badge");
				return false;
			} else {
				this.clearBadgeError();
				return true;
			}
		} catch (error) {
			console.error("Error validating badge:", error);
			return false;
		}
	}

	validateMessage() {
		try {
			const message = this.messageTarget.value.trim();

			if (!message) {
				this.showMessageError("Message is required");
				return false;
			} else if (message.length < 10) {
				this.showMessageError("Message must be at least 10 characters long");
				return false;
			} else if (message.length > 500) {
				this.showMessageError("Message must be less than 500 characters");
				return false;
			} else {
				this.clearMessageError();
				return true;
			}
		} catch (error) {
			console.error("Error validating message:", error);
			return false;
		}
	}

	showRecipientError(message) {
		try {
			if (this.hasRecipientErrorTarget) {
				this.recipientErrorTarget.textContent = message;
				this.recipientErrorTarget.style.display = "block";
				this.recipientTarget.classList.add("is-invalid");
			}
		} catch (error) {
			console.error("Error showing recipient error:", error);
		}
	}

	clearRecipientError() {
		try {
			if (this.hasRecipientErrorTarget) {
				this.recipientErrorTarget.style.display = "none";
				this.recipientTarget.classList.remove("is-invalid");
			}
		} catch (error) {
			console.error("Error clearing recipient error:", error);
		}
	}

	showBadgeError(message) {
		try {
			if (this.hasBadgeErrorTarget) {
				this.badgeErrorTarget.textContent = message;
				this.badgeErrorTarget.style.display = "block";
				this.badgeTarget.classList.add("is-invalid");
			}
		} catch (error) {
			console.error("Error showing badge error:", error);
		}
	}

	clearBadgeError() {
		try {
			if (this.hasBadgeErrorTarget) {
				this.badgeErrorTarget.style.display = "none";
				this.badgeTarget.classList.remove("is-invalid");
			}
		} catch (error) {
			console.error("Error clearing badge error:", error);
		}
	}

	showMessageError(message) {
		try {
			if (this.hasMessageErrorTarget) {
				this.messageErrorTarget.textContent = message;
				this.messageErrorTarget.style.display = "block";
				this.messageTarget.classList.add("is-invalid");
			}
		} catch (error) {
			console.error("Error showing message error:", error);
		}
	}

	clearMessageError() {
		try {
			if (this.hasMessageErrorTarget) {
				this.messageErrorTarget.style.display = "none";
				this.messageTarget.classList.remove("is-invalid");
			}
		} catch (error) {
			console.error("Error clearing message error:", error);
		}
	}

	validateForm(event) {
		try {
			const isRecipientValid = this.validateRecipient();
			const isBadgeValid = this.validateBadge();
			const isMessageValid = this.validateMessage();

			if (!isRecipientValid || !isBadgeValid || !isMessageValid) {
				if (event) event.preventDefault();
				return false;
			}

			// Disable submit button while processing
			this.disableSubmitButton();

			return true;
		} catch (error) {
			console.error("Error validating form:", error);
			if (event) event.preventDefault();
			return false;
		}
	}
}
