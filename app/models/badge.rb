class Badge < ApplicationRecord
  has_many :recognitions

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  # Return the image path for this badge
  def image_path
    "#{slug}.png"
  end

  # Return a color theme for this badge
  def theme_color
    case slug
    when "team_player"
      "#4A90E2" # Blue
    when "innovator"
      "#F39C12" # Orange
    when "customer_hero"
      "#E74C3C" # Red
    when "mentor"
      "#27AE60" # Green
    else
      "#95A5A6" # Gray
    end
  end
end
