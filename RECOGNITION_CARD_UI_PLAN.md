# Recognition List Card UI Update Plan

## Overview

This document outlines the plan to transform recognition list items from simple text-based list items to visually rich horizontal Bootstrap 5 cards featuring badge images, better typography, and improved visual hierarchy.

---

## 1. Current State Analysis

### Current Implementation

**File**: `app/views/recognitions/_list_item.html.erb`

```erb
<li class="list-group-item d-flex flex-column gap-1 new-recognition-item">
  <div>
    <strong><%= recognition.sender.name %></strong>
    recognized
    <strong><%= recognition.recipient.name %></strong>
    with
    <span class="badge text-bg-secondary"><%= recognition.badge.name %></span>
    🎉
  </div>
  <div class="text-muted"><%= recognition.message %></div>
  <div class="text-muted" style="font-size: 0.7rem;">
    <%= time_ago_in_words(recognition.created_at) %> ago
  </div>
</li>
```

### Current Issues

- **No visual hierarchy** - Everything is text-based
- **No badge representation** - Only shows badge name, no imagery
- **Generic appearance** - Looks like a standard list
- **Limited information density** - Could show more details
- **No brand personality** - Doesn't leverage available badge assets

### Available Badge Assets

From `db/seeds.rb` and `app/assets/images/`:

| Badge Name    | Slug            | Image File          |
| ------------- | --------------- | ------------------- |
| Team Player   | `team_player`   | `team_player.png`   |
| Innovator     | `innovator`     | `innovator.png`     |
| Customer Hero | `customer_hero` | `customer_hero.png` |
| Mentor        | `mentor`        | `mentor.png`        |

---

## 2. Proposed Design: Horizontal Card Layout

### Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                 │
│ │         │  Alice Admin recognized Bob Builder             │
│ │  Badge  │  with Team Player 🏆                            │
│ │  Image  │                                                 │
│ │         │  Thanks for helping with the release!          │
│ │         │                                                 │
│ └─────────┘  🕐 2 minutes ago                               │
└─────────────────────────────────────────────────────────────┘
```

### Design Features

✨ **Badge Image Display**

- Left side of card (col-md-4 or col-4)
- Circular or rounded square presentation
- Consistent sizing across all cards
- Subtle shadow/glow effect

✨ **Content Section**

- Right side of card (col-md-8 or col-8)
- Clear sender → recipient flow
- Badge name with icon
- Message prominently displayed
- Timestamp in muted text

✨ **Card Styling**

- Subtle shadow for depth
- Rounded corners (border-radius)
- Hover effect for interactivity
- Responsive spacing
- Smooth animation on appearance

---

## 3. Implementation Details

### 3.1 Badge Helper Method

First, create a helper method to map badge slugs to image paths.

**File**: `app/helpers/application_helper.rb`

```ruby
module ApplicationHelper
  def badge_image_path(badge)
    # Map badge slug to image filename
    image_name = "#{badge.slug}.png"
    asset_path(image_name)
  rescue StandardError => e
    # Fallback to a default image or placeholder
    Rails.logger.error("Badge image not found: #{badge.slug}")
    asset_path("recognize-logo.png") # fallback
  end
end
```

**Alternative**: Add method to Badge model

**File**: `app/models/badge.rb`

```ruby
class Badge < ApplicationRecord
  has_many :recognitions

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  # Return the image path for this badge
  def image_path
    "#{slug}.png"
  end

  # Return a color theme for this badge (optional)
  def theme_color
    case slug
    when 'team_player'
      '#4A90E2' # Blue
    when 'innovator'
      '#F39C12' # Orange
    when 'customer_hero'
      '#E74C3C' # Red
    when 'mentor'
      '#27AE60' # Green
    else
      '#95A5A6' # Gray
    end
  end
end
```

### 3.2 Updated List Item Partial

**File**: `app/views/recognitions/_list_item.html.erb`

```erb
<div class="card mb-3 recognition-card new-recognition-item" data-recognition-id="<%= recognition.id %>">
  <div class="row g-0">
    <!-- Badge Image Column -->
    <div class="col-md-3 col-4 d-flex align-items-center justify-content-center bg-light">
      <div class="badge-image-container p-3">
        <%= image_tag recognition.badge.image_path,
            alt: recognition.badge.name,
            class: "img-fluid rounded-circle badge-image",
            loading: "lazy" %>
      </div>
    </div>

    <!-- Content Column -->
    <div class="col-md-9 col-8">
      <div class="card-body">
        <!-- Recognition Header -->
        <div class="d-flex align-items-start justify-content-between mb-2">
          <div>
            <h6 class="card-title mb-1">
              <span class="fw-bold text-primary"><%= recognition.sender.name %></span>
              <span class="text-muted">recognized</span>
              <span class="fw-bold text-success"><%= recognition.recipient.name %></span>
            </h6>
            <div class="badge-info">
              <span class="badge bg-secondary-subtle text-secondary-emphasis">
                <i class="ph ph-trophy me-1"></i>
                <%= recognition.badge.name %>
              </span>
            </div>
          </div>
        </div>

        <!-- Message -->
        <p class="card-text mb-2">
          <%= recognition.message %>
        </p>

        <!-- Timestamp -->
        <p class="card-text">
          <small class="text-muted">
            <i class="ph ph-clock me-1"></i>
            <%= time_ago_in_words(recognition.created_at) %> ago
          </small>
        </p>
      </div>
    </div>
  </div>
</div>
```

### 3.3 Alternative: More Compact Design

For a more compact view:

```erb
<div class="card mb-3 recognition-card-compact new-recognition-item shadow-sm">
  <div class="row g-0 align-items-center">
    <!-- Badge Image - Smaller -->
    <div class="col-auto">
      <div class="badge-image-wrapper">
        <%= image_tag recognition.badge.image_path,
            alt: recognition.badge.name,
            class: "badge-image-small",
            loading: "lazy" %>
      </div>
    </div>

    <!-- Content - Takes remaining space -->
    <div class="col">
      <div class="card-body py-3">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start">
          <div class="flex-grow-1">
            <!-- Header -->
            <div class="mb-1">
              <strong class="text-primary"><%= recognition.sender.name %></strong>
              <i class="ph ph-arrow-right mx-1 text-muted"></i>
              <strong class="text-success"><%= recognition.recipient.name %></strong>
              <span class="badge bg-light text-dark ms-2">
                <%= recognition.badge.name %>
              </span>
            </div>

            <!-- Message -->
            <p class="text-muted mb-1 small"><%= recognition.message %></p>
          </div>

          <!-- Timestamp -->
          <div class="text-end text-nowrap ms-3">
            <small class="text-muted">
              <i class="ph ph-clock"></i>
              <%= time_ago_in_words(recognition.created_at) %> ago
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 3.4 Update List Container

**File**: `app/views/recognitions/_list.html.erb`

**Before:**

```erb
<ul class="list-group small" id="recent_recognitions">
  <% recognitions.each do |recognition| %>
    <%= render partial: "recognitions/list_item", locals: { recognition: recognition } %>
  <% end %>
  <% if recognitions.empty? %>
    <li class="list-group-item text-muted">No recognitions yet.</li>
  <% end %>
</ul>
```

**After:**

```erb
<div class="recognition-list" id="recent_recognitions">
  <% recognitions.each do |recognition| %>
    <%= render partial: "recognitions/list_item", locals: { recognition: recognition } %>
  <% end %>

  <% if recognitions.empty? %>
    <div class="card mb-3">
      <div class="card-body text-center text-muted py-5">
        <i class="ph ph-trophy fs-1 mb-3 d-block"></i>
        <p class="mb-0">No recognitions yet. Be the first to recognize someone!</p>
      </div>
    </div>
  <% end %>
</div>
```

---

## 4. CSS Styling

**File**: `app/assets/stylesheets/_recognition_cards.scss`

```scss
// Recognition Card Styles

.recognition-card {
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .card-body {
    padding: 1.25rem;
  }
}

// Badge Image Container
.badge-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 150px;

  @media (max-width: 768px) {
    min-height: 120px;
  }
}

.badge-image {
  width: 100%;
  max-width: 120px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    max-width: 80px;
  }

  &:hover {
    transform: scale(1.05);
  }
}

// Compact card variant
.recognition-card-compact {
  .badge-image-wrapper {
    padding: 1rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-right: 1px solid rgba(0, 0, 0, 0.05);
  }

  .badge-image-small {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 12px;

    @media (max-width: 576px) {
      width: 60px;
      height: 60px;
    }
  }
}

// Recognition list container
.recognition-list {
  .card {
    border-radius: 12px;
  }
}

// Card title styling
.recognition-card {
  .card-title {
    font-size: 0.95rem;
    line-height: 1.4;

    @media (max-width: 768px) {
      font-size: 0.875rem;
    }
  }

  .card-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #6c757d;

    @media (max-width: 768px) {
      font-size: 0.85rem;
    }
  }
}

// Badge pill styling
.badge-info {
  .badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.35rem 0.65rem;
    border-radius: 0.5rem;
  }
}

// Empty state
.recognition-list {
  .ph {
    color: #dee2e6;
  }
}

// Animation for new items (keep existing)
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.new-recognition-item {
  animation: slideInDown 0.4s ease-out;
}

// Responsive adjustments
@media (max-width: 768px) {
  .recognition-card {
    .row {
      margin: 0;
    }

    .card-body {
      padding: 1rem;
    }
  }

  .badge-image-container {
    padding: 0.75rem !important;
  }
}

// Badge-specific background colors (optional enhancement)
.recognition-card {
  &[data-badge-slug="team_player"] {
    .badge-image-container {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    }
  }

  &[data-badge-slug="innovator"] {
    .badge-image-container {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    }
  }

  &[data-badge-slug="customer_hero"] {
    .badge-image-container {
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    }
  }

  &[data-badge-slug="mentor"] {
    .badge-image-container {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    }
  }
}
```

### Import in styles.scss

**File**: `app/frontend/entrypoints/styles.scss`

```scss
@import "bootstrap/scss/bootstrap";

// Import modal styles
@import "../../assets/stylesheets/modal";

// Import recognition card styles
@import "../../assets/stylesheets/recognition_cards";

body {
  padding-top: 60px;
}
// ... rest of existing styles
```

---

## 5. Enhanced Version with Badge Colors

If you want to add badge-specific data attributes for styling:

**File**: `app/views/recognitions/_list_item.html.erb`

```erb
<div class="card mb-3 recognition-card new-recognition-item"
     data-recognition-id="<%= recognition.id %>"
     data-badge-slug="<%= recognition.badge.slug %>">
  <!-- Card content here -->
</div>
```

---

## 6. Responsive Design Considerations

### Mobile (< 576px)

- Stack image on top or use smaller side image
- Reduce padding and margins
- Smaller font sizes
- Compact layout

### Tablet (576px - 992px)

- Side-by-side layout with adjusted proportions
- Medium-sized badge images
- Comfortable spacing

### Desktop (> 992px)

- Full horizontal card layout
- Larger badge images
- Generous spacing
- Hover effects

---

## 7. Alternative Layouts

### Option A: Vertical Card for Mobile

```erb
<div class="card mb-3 recognition-card">
  <!-- Mobile: Stack vertically -->
  <div class="d-md-none">
    <div class="badge-image-container text-center p-3 bg-light">
      <%= image_tag recognition.badge.image_path,
          class: "badge-image-small",
          alt: recognition.badge.name %>
    </div>
    <div class="card-body">
      <!-- Content -->
    </div>
  </div>

  <!-- Desktop: Horizontal layout -->
  <div class="row g-0 d-none d-md-flex">
    <!-- Horizontal layout code -->
  </div>
</div>
```

### Option B: List Group with Custom Items

```erb
<div class="list-group-item list-group-item-action recognition-item new-recognition-item">
  <div class="d-flex w-100 align-items-center">
    <div class="me-3">
      <%= image_tag recognition.badge.image_path,
          class: "rounded-circle",
          style: "width: 60px; height: 60px; object-fit: cover;",
          alt: recognition.badge.name %>
    </div>
    <div class="flex-grow-1">
      <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-1">
          <strong><%= recognition.sender.name %></strong>
          →
          <strong><%= recognition.recipient.name %></strong>
        </h6>
        <small><%= time_ago_in_words(recognition.created_at) %> ago</small>
      </div>
      <p class="mb-1"><%= recognition.message %></p>
      <small class="badge bg-secondary"><%= recognition.badge.name %></small>
    </div>
  </div>
</div>
```

---

## 8. Image Optimization

### Recommendations

1. **Optimize PNG files** - Reduce file size without quality loss

   ```bash
   # Using ImageMagick
   mogrify -strip -resize 200x200 app/assets/images/*.png
   ```

2. **Add WebP versions** - Modern format for better performance

   ```bash
   # Convert to WebP
   cwebp -q 80 team_player.png -o team_player.webp
   ```

3. **Lazy loading** - Already included in the template (`loading="lazy"`)

4. **Responsive images** - Consider using `srcset` for different sizes

```erb
<%= image_tag recognition.badge.image_path,
    srcset: {
      asset_path("#{recognition.badge.slug}_small.png") => "1x",
      asset_path("#{recognition.badge.slug}.png") => "2x"
    },
    class: "img-fluid",
    alt: recognition.badge.name %>
```

---

## 9. Accessibility Enhancements

### ARIA Attributes

```erb
<article class="card mb-3 recognition-card"
         role="article"
         aria-label="Recognition from <%= recognition.sender.name %> to <%= recognition.recipient.name %>">
  <div class="row g-0">
    <div class="col-md-3">
      <%= image_tag recognition.badge.image_path,
          alt: "#{recognition.badge.name} badge",
          role: "img",
          class: "img-fluid" %>
    </div>
    <div class="col-md-9">
      <div class="card-body">
        <h6 class="card-title" id="recognition-<%= recognition.id %>-title">
          <!-- Content -->
        </h6>
        <p class="card-text" aria-describedby="recognition-<%= recognition.id %>-title">
          <%= recognition.message %>
        </p>
      </div>
    </div>
  </div>
</article>
```

---

## 10. Implementation Phases

### Phase 1: Basic Card Structure (30 mins)

1. ✅ Add `image_path` method to Badge model
2. ✅ Update `_list_item.html.erb` with horizontal card
3. ✅ Update `_list.html.erb` container from `<ul>` to `<div>`
4. ✅ Test basic rendering

### Phase 2: Styling (45 mins)

1. ✅ Create `_recognition_cards.scss`
2. ✅ Add card shadows and hover effects
3. ✅ Style badge image containers
4. ✅ Add responsive breakpoints
5. ✅ Import in `styles.scss`

### Phase 3: Enhancement (30 mins)

1. ✅ Add badge-specific gradient backgrounds
2. ✅ Optimize typography hierarchy
3. ✅ Add icons (clock, trophy, arrow)
4. ✅ Test on different screen sizes

### Phase 4: Polish & Testing (30 mins)

1. ✅ Test animation with Turbo Streams
2. ✅ Verify all badge images load correctly
3. ✅ Test responsive behavior
4. ✅ Check accessibility with screen reader
5. ✅ Browser compatibility testing

**Total Estimated Time**: 2-2.5 hours

---

## 11. Testing Checklist

### Visual Testing

- [ ] All badge images display correctly
- [ ] Card layout responsive on mobile
- [ ] Card layout responsive on tablet
- [ ] Card layout responsive on desktop
- [ ] Hover effects work smoothly
- [ ] Animations work with Turbo Stream updates
- [ ] Empty state displays properly

### Functional Testing

- [ ] Cards render for all badge types
- [ ] Fallback works if image missing
- [ ] Lazy loading works
- [ ] No layout shift on image load
- [ ] Turbo Stream prepend works correctly

### Accessibility Testing

- [ ] Images have proper alt text
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly

### Performance Testing

- [ ] Images load efficiently
- [ ] No performance impact on large lists
- [ ] Smooth animations (60fps)
- [ ] No layout thrashing

---

## 12. Recommended Design Choice

### ✨ Recommended: **Horizontal Card with Gradient Background**

**Why?**

- ✅ **Visual Impact**: Badge images are prominently displayed
- ✅ **Modern Look**: Clean, card-based design is contemporary
- ✅ **Flexible**: Works well with varying message lengths
- ✅ **Brand Identity**: Gradient backgrounds add personality
- ✅ **Responsive**: Adapts well to different screen sizes
- ✅ **User-Friendly**: Clear information hierarchy
- ✅ **Engaging**: Hover effects provide subtle interactivity

**Layout**:

- Desktop: 25/75 split (col-md-3 / col-md-9)
- Mobile: 33/67 split (col-4 / col-8)
- Badge image with circular mask
- Gradient background based on badge type
- Shadow and hover lift effect

---

## 13. File Changes Summary

### New Files

- **`app/assets/stylesheets/_recognition_cards.scss`** - Card-specific styles

### Modified Files

- **`app/models/badge.rb`** - Add `image_path` and optionally `theme_color` methods
- **`app/views/recognitions/_list_item.html.erb`** - Transform to horizontal card
- **`app/views/recognitions/_list.html.erb`** - Change container from `<ul>` to `<div>`
- **`app/frontend/entrypoints/styles.scss`** - Import new stylesheet

### Asset Files Used

- `app/assets/images/team_player.png`
- `app/assets/images/innovator.png`
- `app/assets/images/customer_hero.png`
- `app/assets/images/mentor.png`

---

## 14. Future Enhancements

### Potential Additions

- **Badge tooltips**: Show badge description on hover
- **User avatars**: Add sender/recipient profile pictures
- **Reaction buttons**: Like, applaud, celebrate
- **Share functionality**: Share recognition externally
- **Badge rarity**: Visual indicator for rare badges
- **Achievement animations**: Confetti or sparkles for special badges
- **Badge gallery**: Modal showing badge details
- **Recognition threads**: Reply/comment on recognitions

---

## 15. Example Final Output

### Desktop View

```
┌────────────────────────────────────────────────────────────────────┐
│ ┌──────────┐                                                       │
│ │          │  Alice Admin recognized Bob Builder                   │
│ │  [Team   │  🏆 Team Player                                       │
│ │  Player  │                                                       │
│ │  Badge]  │  Thanks for helping with the release! Your           │
│ │          │  collaboration made it possible.                      │
│ │  (Blue   │                                                       │
│ │ Gradient)│  🕐 5 minutes ago                                     │
│ └──────────┘                                                       │
└────────────────────────────────────────────────────────────────────┘
```

### Mobile View

```
┌───────────────────────────┐
│ ┌────┐                    │
│ │ 🏆 │ Alice → Bob         │
│ │    │ Team Player         │
│ └────┘                    │
│                           │
│ Thanks for helping with   │
│ the release!              │
│                           │
│ 🕐 5 minutes ago          │
└───────────────────────────┘
```

---

## Conclusion

This plan transforms the recognition list from a simple text-based list to a visually rich, engaging card-based interface that:

1. **Showcases badge images** - Visual identity for each recognition type
2. **Improves hierarchy** - Clear sender → recipient → message flow
3. **Enhances engagement** - Interactive hover effects and animations
4. **Maintains performance** - Optimized images and lazy loading
5. **Ensures accessibility** - Proper ARIA labels and semantic HTML
6. **Responsive design** - Adapts beautifully across all devices

The horizontal card layout with badge-specific gradient backgrounds provides the best balance of visual impact, information density, and user experience.

---

**Document Version**: 1.0  
**Created**: October 15, 2025  
**Author**: Rails/Bootstrap 5/UI Specialist  
**Status**: Ready for Implementation  
**Estimated Implementation Time**: 2-2.5 hours
