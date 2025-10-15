# Notification Feature - Testing Guide

## 🎉 Implementation Complete!

The pop-up notification feature has been successfully implemented. Here's how to test it.

---

## 🚀 Getting Started

### 1. Start the Development Server

```bash
bin/dev
```

### 2. Log in to the Application

Navigate to the login page and log in with any user account.

---

## ✅ What to Expect

### Automatic Demo Mode

When you're logged in, the notification system will automatically:

- **First notification**: Appears 5 seconds after page load
- **Subsequent notifications**: Appear every 30 seconds
- **Badge counter**: Increments with each notification
- **Sound**: Plays a subtle "ping" sound

### Visual Elements

1. **Bell Icon**: Located in the top navigation bar (right side)
2. **Badge Counter**: Red circular badge on the bell icon showing unread count
3. **Toast Notifications**: Pop up in the top-right corner with:
   - Badge emoji
   - Sender name
   - Badge name
   - Recognition message
   - Auto-dismiss after 8 seconds

---

## 🧪 Manual Testing

### Trigger a Test Notification

Open your browser's Developer Console and run:

```javascript
document
  .querySelector('[data-controller="notification"]')
  .__stimulusController.triggerTestNotification();
```

This will immediately show a notification with random mock data.

### Test Multiple Notifications

Run the command multiple times to see how multiple notifications stack:

```javascript
const controller = document.querySelector(
  '[data-controller="notification"]'
).__stimulusController;
controller.triggerTestNotification();
setTimeout(() => controller.triggerTestNotification(), 500);
setTimeout(() => controller.triggerTestNotification(), 1000);
```

---

## 🎯 Features to Verify

### ✨ Toast Behavior

- [ ] Toast appears in top-right corner
- [ ] Shows sender name, badge emoji, badge name, and message
- [ ] Has a close button (X)
- [ ] Auto-dismisses after 8 seconds
- [ ] Can be manually dismissed by clicking X
- [ ] Smooth fade-in animation
- [ ] Smooth fade-out animation

### 🔔 Badge Counter

- [ ] Starts hidden (no badge shown)
- [ ] Appears when first notification arrives
- [ ] Shows correct count
- [ ] Increments with each new notification
- [ ] Decrements when toast is dismissed
- [ ] Has subtle pulse animation
- [ ] Hides when count reaches 0

### 🔊 Sound

- [ ] Plays subtle notification sound
- [ ] Not too loud or jarring
- [ ] Works in different browsers

### 📱 Responsive Design

- [ ] Works on desktop (1920x1080+)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on mobile (375px - 767px)
- [ ] Toasts don't overflow screen
- [ ] Touch-friendly close button

### 🌐 Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🎨 Mock Data

The system uses realistic mock data:

### Sample Senders

- Sarah Johnson
- Mike Chen
- Emily Rodriguez
- David Kim
- Jessica Martinez

### Sample Badges

- 🤝 Team Player
- 💡 Innovation Star
- 🦸 Customer Hero
- 🎯 Problem Solver
- 🌟 Above & Beyond

### Sample Messages

- "Your dedication to the project was outstanding!"
- "Thanks for going above and beyond to help the team."
- "Your innovative solution saved us hours of work!"
- "Great job on the presentation today!"
- "Your attention to detail made all the difference."

---

## ⚙️ Configuration

### Disable Demo Mode

If you want to disable automatic notifications, edit `app/views/layouts/application.html.erb`:

```erb
<body data-controller="notification"
      data-notification-user-id-value="<%= current_user&.id %>"
      data-notification-demo-mode-value="false">
```

### Adjust Timing

Edit `app/frontend/controllers/notification_controller.js`:

```javascript
// Change initial delay (line ~51)
setTimeout(() => {
  this.showMockNotification();
}, 10000); // 10 seconds instead of 5

// Change interval (line ~54)
this.demoInterval = setInterval(() => {
  this.showMockNotification();
}, 60000); // 60 seconds instead of 30
```

### Customize Toast Duration

Edit `app/frontend/controllers/notification_controller.js` (line ~126):

```javascript
const bsToast = new bootstrap.Toast(toast, {
  autohide: true,
  delay: 5000, // 5 seconds instead of 8
});
```

---

## 🐛 Troubleshooting

### No notifications appearing?

1. **Check console for errors**: Open Developer Tools → Console
2. **Verify controller is connected**: Look for "Notification controller connected" message
3. **Restart dev server**: Stop and run `bin/dev` again
4. **Clear browser cache**: Hard refresh with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Bell icon not showing?

1. **Verify you're logged in**: Bell only shows for authenticated users
2. **Check SVG rendering**: Inspect element in Developer Tools

### Sound not playing?

1. **Check browser audio permissions**: Some browsers require user interaction first
2. **Unmute browser tab**: Verify tab is not muted
3. **Check browser compatibility**: Older browsers may not support Web Audio API

### Badge counter not updating?

1. **Check console for errors**: Look for "Error updating badge count" messages
2. **Verify target exists**: Badge element should be in the DOM

---

## 📝 Files Modified/Created

### New Files

- ✅ `app/frontend/controllers/notification_controller.js` - Main controller logic

### Modified Files

- ✅ `app/views/layouts/application.html.erb` - Added bell icon and data attributes
- ✅ `app/frontend/entrypoints/styles.scss` - Added toast and bell icon styles

---

## 🔮 Future Enhancements

When ready to integrate with a real backend:

1. **Replace mock data** with API calls
2. **Add polling mechanism** to fetch new recognitions
3. **Implement ActionCable** for real-time WebSocket updates
4. **Add notification history** page
5. **Add preferences** (sound on/off, frequency)
6. **Add desktop notifications** using Notifications API

---

## 📚 Related Documentation

- [Stimulus Handbook](https://stimulus.hotwired.dev/)
- [Bootstrap 5 Toasts](https://getbootstrap.com/docs/5.3/components/toasts/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## ✨ Demo Tips

When demonstrating this feature:

1. **Start fresh**: Clear browser cache and reload
2. **Wait for first notification**: Give it 5 seconds after login
3. **Show manual trigger**: Use console command to impress
4. **Stack multiple**: Show how they handle multiple notifications
5. **Test dismissal**: Show both auto and manual dismiss
6. **Show counter**: Point out the badge incrementing/decrementing
7. **Mobile responsive**: Resize browser to show mobile view

---

**Happy Testing! 🎊**

If you encounter any issues or have suggestions, feel free to create an issue or submit a pull request.
