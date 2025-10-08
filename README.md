# Recognitions FrontEnd Developer Test App

Minimal Rails 8 application. It provides a barebones employee recognition feature with simple, hand‑rolled email/password auth and intentionally light styling. Your job (as a candidate) will be to enhance UX/UI, add interactivity, improve structure, and/or extend features.

## Your Mission
Improve the look, feel and user experience of this application using your best judgement and skills. We would like to see:
* Improved styling of the application both logged out and logged in using Bootstrap 5
* Improved interactivity with javascript, ideally Hotwire/Turbo/Stimulus based javascript.

---
## 1. Tech Stack
Rails 8 (Ruby 3.3)
SQLite (dev/test)
Sass via dartsass-rails
Vite (JS/CSS bundling) + Bootstrap 5 (basic layout only)
bcrypt (simple auth)

Hotwire pieces (Turbo/Stimulus) are present but not used currently. It is highly encouraged to use them.

---
## 2. Prerequisites
Install/asdf (recommended) or have these available:
Ruby 3.3.7 (see `.ruby-version`)
Node.js 22.x (see `.tool-versions`)
Bundler (comes with recent Rubies)
SQLite 3
Foreman gem (auto-installed by `bin/dev` if missing)

Confirm versions:
`ruby -v`
`node -v`
`sqlite3 --version`

---
## 3. Initial Setup
Clone repo then run:
`bundle install`
`npm install`
`bin/rails db:setup` (creates, migrates, seeds) OR run individually:
`bin/rails db:create`
`bin/rails db:migrate`
`bin/rails db:seed`

Seeds create:
- Users: alice@example.com, bob@example.com, carol@example.com (password: `password`)
- Badges: Team Player, Innovator, Customer Hero, Mentor
- One sample recognition

---
## 4. Running the App (Dev)
Preferred (starts Rails, Vite, Sass watchers):
`bin/dev`

Then visit: http://localhost:3000

If you need to run pieces manually:
`bin/rails server`
`npx vite`
`bin/rails dartsass:watch`

---
## 5. Authentication
Very minimal sessions-based auth.
Login path: `/login`
Logout: form/button triggering DELETE `/logout`
Session stored via `session[:user_id]`.
Model: `User` with `has_secure_password` (bcrypt backed).
No password reset, confirmation, or lockouts—keep it simple.

---
## 6. Core Domain Models
User: name, email (unique), password_digest
Badge: name, slug (unique)
Recognition: sender_id, recipient_id, badge_id, message

Associations:
- User has many sent/received recognitions
- Recognition belongs to sender (User), recipient (User), badge

---
## 7. Front-End Entrypoint (Vite)
Entry JS: `app/frontend/entrypoints/application.js`
Styles: `app/frontend/entrypoints/styles.scss`
Bootstrap imported; minimal custom CSS.
Layout: `app/views/layouts/application.html.erb` uses `vite_client_tag` + `vite_javascript_tag`.

---
## 8. Feature Walkthrough
Root `/` (protected) shows:
1. Form to send a recognition (select recipient, badge, write message)
2. List of recent recognitions

Improvement targets (intentionally basic):
- No pagination
- No AJAX/HMR interactions
- Minimal validation feedback styling
- No accessibility review

---
## 12. Troubleshooting
Vite not serving assets? Ensure `bin/dev` includes `vite:` line in `Procfile.dev`.
Styles missing? Check `application.scss` vs `styles.scss` usage; ensure imports correct.
Auth loop? Confirm session cookie domain not blocked and user exists.
Node version errors? Run `asdf install` (if using asdf) or install Node 22.x.

---
## 14. Quick Start (Copy/Paste)
`bundle install && npm install && bin/rails db:setup && bin/dev`

Login with: alice@example.com / password

---
Happy building.
