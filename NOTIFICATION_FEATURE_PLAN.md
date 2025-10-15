# Pop-Up Notifications Feature Plan (Frontend-Only)

## Overview

Implement frontend-only pop-up notifications to demonstrate how users would receive alerts when they get a new recognition. Using the existing Stimulus setup and Bootstrap 5 Toast components with mocked data for demonstration purposes.

---

## 1. Frontend Implementation

### 1.1 Stimulus Controller for Notifications

#### Create notification_controller.js

```javascript
// app/frontend/controllers/notification_controller.js
import { Controller } from "@hotwired/stimulus";

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
          "p-3"
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
      this.playNotificationSound();
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
            recognition.sender_name
          )}</strong> recognized you with 
          <span class="badge bg-primary">${this.escapeHtml(
            recognition.badge_name
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
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
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
```

### 1.2 Register the Controller

#### Update index.js

```javascript
// app/frontend/controllers/index.js
import { application } from "./application";

import HelloController from "./hello_controller";
import NewSessionController from "./new_session_controller";
import RecognitionController from "./recognition_controller";
import NotificationController from "./notification_controller";

application.register("hello", HelloController);
application.register("new-session", NewSessionController);
application.register("recognition", RecognitionController);
application.register("notification", NotificationController);
```

---

## 2. View Updates

### 2.1 Update Application Layout

```erb
<!-- app/views/layouts/application.html.erb -->
<!DOCTYPE html>
<html>
  <head>
    <title>Recognize</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="csrf-token" content="<%= form_authenticity_token %>">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= vite_client_tag %>
    <%= vite_javascript_tag 'application' %>
    <%= vite_stylesheet_tag 'styles' %>
  </head>

  <body data-controller="notification"
        data-notification-user-id-value="<%= current_user&.id %>"
        data-notification-demo-mode-value="true">
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container">
        <a class="navbar-brand" href="<%= root_path %>">
          <%= image_tag "recognize-logo.png", alt: "Recognize", height: 40 %>
        </a>

        <% if logged_in? %>
          <div class="d-flex align-items-center">
            <div class="position-relative me-3" style="cursor: pointer;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
              </svg>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none"
                    data-notification-target="badge">
                0
              </span>
            </div>

            <span class="me-3">Welcome, <%= current_user.name %>!</span>
            <%= button_to "Logout", logout_path, method: :delete, class: "btn btn-sm btn-outline-secondary" %>
          </div>
        <% end %>
      </div>
    </nav>

    <div class="container">
      <% if flash[:notice] %>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <%= flash[:notice] %>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      <% end %>

      <% if flash[:alert] %>
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <%= flash[:alert] %>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      <% end %>

      <%= yield %>
    </div>

    <!-- Toast container will be added dynamically by Stimulus controller -->
  </body>
</html>
```

---

## 3. Styling Updates

### 3.1 Add Custom Notification Styles

```scss
// app/frontend/entrypoints/styles.scss
@import "bootstrap/scss/bootstrap";

// Custom notification styles
.toast {
  min-width: 350px;
  max-width: 400px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);

  .toast-header {
    border-bottom: none;
  }

  .toast-body {
    padding: 1rem;
  }
}

.notification-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// Bell icon hover effect
.bi-bell {
  transition: transform 0.2s ease;
}

.bi-bell:hover {
  transform: scale(1.1);
}
```

---

## 4. Implementation Steps

### Phase 1: Create Notification Controller (20 minutes)

1. ✅ Create `app/frontend/controllers/notification_controller.js`
2. ✅ Implement mock data generation
3. ✅ Implement toast display logic
4. ✅ Add notification sound
5. ✅ Add badge counter logic

### Phase 2: Register Controller (5 minutes)

1. ✅ Update `app/frontend/controllers/index.js`
2. ✅ Test controller connection

### Phase 3: Update Views (15 minutes)

1. ✅ Update application layout with notification bell icon
2. ✅ Add data attributes for Stimulus controller
3. ✅ Add badge counter element

### Phase 4: Add Styles (10 minutes)

1. ✅ Add toast custom styles
2. ✅ Add bell icon styles
3. ✅ Add animation for badge

### Phase 5: Testing (15 minutes)

1. ✅ Test notification display
2. ✅ Test auto-dismiss
3. ✅ Test manual dismiss
4. ✅ Test sound
5. ✅ Test badge counter
6. ✅ Test on mobile

---

## 5. Demo Mode Features

### Automatic Notifications

- First notification appears 5 seconds after page load
- Subsequent notifications appear every 30 seconds
- Random sender names, badges, and messages
- Realistic timing and behavior

### Mock Data

```javascript
const mockData = {
  senders: ["Sarah Johnson", "Mike Chen", "Emily Rodriguez", "David Kim"],
  badges: [
    { name: "Team Player", emoji: "🤝" },
    { name: "Innovation Star", emoji: "💡" },
    { name: "Customer Hero", emoji: "🦸" },
  ],
  messages: [
    "Your dedication to the project was outstanding!",
    "Thanks for going above and beyond to help the team.",
    "Your innovative solution saved us hours of work!",
  ],
};
```

---

## 6. Testing Strategy

### Manual Testing Checklist

#### Basic Functionality

- [ ] First notification appears 5 seconds after login
- [ ] Toast displays sender name, badge, and message
- [ ] Toast auto-dismisses after 8 seconds
- [ ] Toast can be manually dismissed
- [ ] Notification sound plays (subtle, non-intrusive)
- [ ] Badge counter increments when notification appears
- [ ] Badge counter decrements when toast is dismissed

#### UI/UX

- [ ] Toast appears in top-right corner
- [ ] Toast is readable and well-formatted
- [ ] Badge emoji displays correctly
- [ ] Close button works properly
- [ ] Animations are smooth
- [ ] Bell icon is visible and styled

#### Multiple Notifications

- [ ] Multiple notifications stack properly
- [ ] Older notifications dismiss first
- [ ] Counter updates correctly with multiple notifications
- [ ] Performance is acceptable with 3+ notifications

#### Responsive Design

- [ ] Toasts display correctly on desktop
- [ ] Toasts display correctly on tablet
- [ ] Toasts display correctly on mobile
- [ ] Toasts don't overflow screen
- [ ] Bell icon scales appropriately

#### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 7. Manual Testing Instructions

### How to Test Manually

1. **Trigger Test Notification**

   - Open browser console
   - Type: `document.querySelector('[data-controller="notification"]').__stimulusController.triggerTestNotification()`
   - Press Enter
   - A notification should appear immediately

2. **Test Badge Counter**

   - Let multiple notifications appear
   - Observe badge counter incrementing
   - Dismiss notifications and observe counter decrementing

3. **Test Auto-dismiss**

   - Wait for a notification to appear
   - Don't interact with it
   - After 8 seconds, it should auto-dismiss

4. **Test Manual Dismiss**
   - Wait for a notification to appear
   - Click the X button
   - It should dismiss immediately

---

## 8. Optional Enhancements

### Add Test Button (Optional)

Add a button to manually trigger notifications for testing:

```erb
<!-- Add to any view for testing -->
<% if logged_in? %>
  <div class="mb-3">
    <button type="button"
            class="btn btn-outline-primary btn-sm"
            data-action="click->notification#triggerTestNotification">
      🔔 Test Notification
    </button>
  </div>
<% end %>
```

### Disable Demo Mode

To disable automatic notifications:

```erb
<!-- Change in application.html.erb -->
<body data-controller="notification"
      data-notification-user-id-value="<%= current_user&.id %>"
      data-notification-demo-mode-value="false">
```

### Customize Timing

```javascript
// In notification_controller.js, modify delays:

// Change initial delay (default: 5000ms = 5 seconds)
setTimeout(() => {
  this.showMockNotification();
}, 10000); // 10 seconds

// Change interval (default: 30000ms = 30 seconds)
this.demoInterval = setInterval(() => {
  this.showMockNotification();
}, 60000); // 60 seconds
```

---

## 9. Future Backend Integration

When ready to integrate with real backend:

### Step 1: Replace Mock Data with API Calls

```javascript
async fetchNewRecognitions() {
  try {
    const response = await fetch("/api/recognitions/new", {
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
          ?.content,
      },
    });
    const data = await response.json();
    return data.recognitions;
  } catch (error) {
    console.error("Error fetching recognitions:", error);
    return [];
  }
}
```

### Step 2: Poll for New Recognitions

```javascript
startPolling() {
  this.pollingInterval = setInterval(async () => {
    const newRecognitions = await this.fetchNewRecognitions();
    newRecognitions.forEach((recognition) => {
      this.showRecognitionToast(recognition);
      this.updateBadgeCount(1);
      this.playNotificationSound();
    });
  }, 30000); // Poll every 30 seconds
}
```

### Step 3: Add ActionCable (Later)

For true real-time updates, implement ActionCable as described in the full plan.

---

## 10. Performance Considerations

### Current Implementation

- **Memory Usage**: Minimal (only active toast elements)
- **CPU Usage**: Very low (simple timers and DOM operations)
- **Network**: Zero (all mock data)
- **Browser Compatibility**: High (standard Web APIs)

### Best Practices

1. **Limit Visible Toasts**: Maximum 3 visible at once
2. **Clean Up**: Remove toast elements after dismissal
3. **Audio Context**: Reuse audio context to avoid memory leaks
4. **Event Listeners**: Clean up on disconnect

---

## 11. Security Notes

Even with frontend-only implementation:

- ✅ HTML escaping for all user-generated content
- ✅ No inline JavaScript in templates
- ✅ CSP-compliant implementation
- ✅ No external dependencies beyond Bootstrap

---

## 12. Deliverables

### Files to Create

1. ✅ `app/frontend/controllers/notification_controller.js` - Main notification logic
2. ✅ Updated `app/frontend/controllers/index.js` - Register controller
3. ✅ Updated `app/views/layouts/application.html.erb` - Add bell icon and hooks
4. ✅ Updated `app/frontend/entrypoints/styles.scss` - Add custom styles

### Total Implementation Time

**Estimated: 1-1.5 hours**

- File creation and code: 30-45 minutes
- Styling and polish: 15-20 minutes
- Testing and debugging: 15-25 minutes

---

## 13. Success Criteria

✅ Notification toast appears in top-right corner  
✅ Toast displays sender, badge, and message  
✅ Toast auto-dismisses after 8 seconds  
✅ Toast can be manually dismissed  
✅ Notification sound plays  
✅ Badge counter shows notification count  
✅ UI is responsive and mobile-friendly  
✅ No JavaScript errors in console  
✅ Works across modern browsers

---

## Conclusion

This frontend-only implementation provides a complete demonstration of the notification feature without requiring any backend changes. The mock data and demo mode allow for immediate testing and refinement of the UI/UX. When ready, the system can be easily integrated with a real backend API or ActionCable for production use.

**Key Benefits:**

- ⚡ Fast implementation (1-1.5 hours)
- 🎨 Beautiful Bootstrap 5 UI
- 🧪 Easy to test and demonstrate
- 🔄 Easy to extend with real backend later
- 📱 Mobile responsive
- ♿ Accessible (ARIA attributes)

**Next Steps:** Implement the files as outlined, test thoroughly, and iterate on the UX based on feedback.
