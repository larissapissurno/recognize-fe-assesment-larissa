import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
	static targets = [
		"password",
		"eyeIcon",
		"eyeSlashIcon",
		"email",
		"emailError",
		"passwordError",
		"submitButton",
	];

	connect() {
		console.log("New Session Controller connected");
		this.setupValidation();
	}

	setupValidation() {
		try {
			// Add event listeners for real-time validation
			if (this.hasEmailTarget) {
				this.emailTarget.addEventListener("blur", () => this.validateEmail());
				this.emailTarget.addEventListener("input", () =>
					this.clearEmailError(),
				);
			}

			if (this.hasPasswordTarget) {
				this.passwordTarget.addEventListener("blur", () =>
					this.validatePassword(),
				);
				this.passwordTarget.addEventListener("input", () =>
					this.clearPasswordError(),
				);
			}
		} catch (error) {
			console.error("Error setting up validation:", error);
		}
	}

	validateEmail() {
		try {
			const email = this.emailTarget.value.trim();
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			if (!email) {
				this.showEmailError("Email is required");
				return false;
			} else if (!emailRegex.test(email)) {
				this.showEmailError("Please enter a valid email address");
				return false;
			} else {
				this.clearEmailError();
				return true;
			}
		} catch (error) {
			console.error("Error validating email:", error);
			return false;
		}
	}

	validatePassword() {
		try {
			const password = this.passwordTarget.value;

			if (!password) {
				this.showPasswordError("Password is required");
				return false;
			} else if (password.length < 6) {
				this.showPasswordError("Password must be at least 6 characters long");
				return false;
			} else {
				this.clearPasswordError();
				return true;
			}
		} catch (error) {
			console.error("Error validating password:", error);
			return false;
		}
	}

	showEmailError(message) {
		try {
			if (this.hasEmailErrorTarget) {
				this.emailErrorTarget.textContent = message;
				this.emailErrorTarget.style.display = "block";
				this.emailTarget.classList.add("is-invalid");
			}
		} catch (error) {
			console.error("Error showing email error:", error);
		}
	}

	clearEmailError() {
		try {
			if (this.hasEmailErrorTarget) {
				this.emailErrorTarget.style.display = "none";
				this.emailTarget.classList.remove("is-invalid");
			}
		} catch (error) {
			console.error("Error clearing email error:", error);
		}
	}

	showPasswordError(message) {
		try {
			if (this.hasPasswordErrorTarget) {
				this.passwordErrorTarget.textContent = message;
				this.passwordErrorTarget.style.display = "block";
				this.passwordTarget.classList.add("is-invalid");
			}
		} catch (error) {
			console.error("Error showing password error:", error);
		}
	}

	clearPasswordError() {
		try {
			if (this.hasPasswordErrorTarget) {
				this.passwordErrorTarget.style.display = "none";
				this.passwordTarget.classList.remove("is-invalid");
			}
		} catch (error) {
			console.error("Error clearing password error:", error);
		}
	}

	validateForm(event) {
		try {
			const isEmailValid = this.validateEmail();
			const isPasswordValid = this.validatePassword();

			if (!isEmailValid || !isPasswordValid) {
				event.preventDefault();
				return false;
			}

			return true;
		} catch (error) {
			console.error("Error validating form:", error);
			event.preventDefault();
			return false;
		}
	}

	togglePassword() {
		try {
			if (this.passwordTarget.type === "password") {
				this.passwordTarget.type = "text";
				this.eyeIconTarget.style.display = "none";
				this.eyeSlashIconTarget.style.display = "inline";
			} else {
				this.passwordTarget.type = "password";
				this.eyeIconTarget.style.display = "inline";
				this.eyeSlashIconTarget.style.display = "none";
			}
		} catch (error) {
			console.error("Error toggling password visibility:", error);
		}
	}
}
