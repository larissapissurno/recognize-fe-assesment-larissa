import { Controller } from "@hotwired/stimulus";
import * as bootstrap from "bootstrap";

export default class extends Controller {
	static targets = ["container", "badge"];
	static values = {
		userId: Number,
		demoMode: { type: Boolean, default: true },
	};

	connect() {
		console.log("Notification controller connected");
		this.setupToastContainer();

		// For demo purposes, simulate notifications
		if (this.demoModeValue) {
			this.startDemoMode();
		}
	}

	disconnect() {
		if (this.demoInterval) {
			clearInterval(this.demoInterval);
		}
	}

	setupToastContainer() {
		try {
			// Ensure we have a container for toasts
			if (!this.hasContainerTarget) {
				const container = document.createElement("div");
				container.classList.add(
					"toast-container",
					"position-fixed",
					"top-0",
					"end-0",
					"p-3",
				);
				container.style.zIndex = "9999";
				container.setAttribute("data-notification-target", "container");
				document.body.appendChild(container);
			}
		} catch (error) {
			console.error("Error setting up toast container:", error);
		}
	}

	// Demo mode: simulate receiving notifications
	startDemoMode() {
		try {
			// Wait 5 seconds after page load, then show first notification
			setTimeout(() => {
				this.showMockNotification();
			}, 5000);

			// Show a new notification every 30 seconds
			this.demoInterval = setInterval(() => {
				this.showMockNotification();
			}, 30000);
		} catch (error) {
			console.error("Error starting demo mode:", error);
		}
	}

	showMockNotification() {
		try {
			const mockRecognition = this.generateMockRecognition();
			this.showRecognitionToast(mockRecognition);
			this.updateBadgeCount(1);
			// this.playNotificationSound();
		} catch (error) {
			console.error("Error showing mock notification:", error);
		}
	}

	generateMockRecognition() {
		const senders = [
			"Sarah Johnson",
			"Mike Chen",
			"Emily Rodriguez",
			"David Kim",
			"Jessica Martinez",
		];
		const badges = [
			{ name: "Team Player", emoji: "🤝" },
			{ name: "Innovation Star", emoji: "💡" },
			{ name: "Customer Hero", emoji: "🦸" },
			{ name: "Problem Solver", emoji: "🎯" },
			{ name: "Above & Beyond", emoji: "🌟" },
		];
		const messages = [
			"Your dedication to the project was outstanding!",
			"Thanks for going above and beyond to help the team.",
			"Your innovative solution saved us hours of work!",
			"Great job on the presentation today!",
			"Your attention to detail made all the difference.",
		];

		const randomSender = senders[Math.floor(Math.random() * senders.length)];
		const randomBadge = badges[Math.floor(Math.random() * badges.length)];
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];

		return {
			id: Date.now(),
			sender_name: randomSender,
			badge_name: randomBadge.name,
			badge_emoji: randomBadge.emoji,
			message: randomMessage,
			created_at: new Date().toISOString(),
		};
	}

	showRecognitionToast(recognition) {
		try {
			const toast = this.createToastElement(recognition);
			const container = this.hasContainerTarget
				? this.containerTarget
				: document.querySelector(".toast-container");

			if (container) {
				container.appendChild(toast);

				// Initialize Bootstrap toast
				const bsToast = new bootstrap.Toast(toast, {
					autohide: true,
					delay: 8000,
				});

				// Show the toast
				bsToast.show();

				// Remove from DOM after hidden
				toast.addEventListener("hidden.bs.toast", () => {
					toast.remove();
				});

				// Simulate marking as read when dismissed
				toast.addEventListener("hidden.bs.toast", () => {
					this.updateBadgeCount(-1);
				});
			}
		} catch (error) {
			console.error("Error showing toast:", error);
		}
	}

	createToastElement(recognition) {
		const toast = document.createElement("div");
		toast.className = "toast";
		toast.setAttribute("role", "alert");
		toast.setAttribute("aria-live", "assertive");
		toast.setAttribute("aria-atomic", "true");

		toast.innerHTML = `
      <div class="toast-header bg-success text-white">
        <span class="me-2" style="font-size: 1.25rem;">${
					recognition.badge_emoji || "🏆"
				}</span>
        <strong class="me-auto">New Recognition!</strong>
        <small class="text-white-50">just now</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        <div class="mb-2">
          <strong>${this.escapeHtml(
						recognition.sender_name,
					)}</strong> recognized you with 
          <span class="badge bg-primary">${this.escapeHtml(
						recognition.badge_name,
					)}</span>
        </div>
        <div class="text-muted small">
          "${this.escapeHtml(recognition.message)}"
        </div>
      </div>
    `;

		return toast;
	}

	updateBadgeCount(increment) {
		try {
			if (this.hasBadgeTarget) {
				const currentCount = parseInt(this.badgeTarget.textContent) || 0;
				const newCount = Math.max(0, currentCount + increment);

				this.badgeTarget.textContent = newCount;

				if (newCount > 0) {
					this.badgeTarget.classList.remove("d-none");
				} else {
					this.badgeTarget.classList.add("d-none");
				}
			}
		} catch (error) {
			console.error("Error updating badge count:", error);
		}
	}

	playNotificationSound() {
		try {
			// Create a subtle notification sound using Web Audio API
			const audioContext = new (
				window.AudioContext || window.webkitAudioContext
			)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = 800;
			oscillator.type = "sine";

			gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + 0.3,
			);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.3);
		} catch (error) {
			console.error("Error playing notification sound:", error);
		}
	}

	escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}

	// Manual trigger for testing
	triggerTestNotification() {
		this.showMockNotification();
	}
}
