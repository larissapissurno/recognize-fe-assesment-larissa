class Recognition < ApplicationRecord
  belongs_to :sender, class_name: "User"
  belongs_to :recipient, class_name: "User"
  belongs_to :badge

  validates :message, presence: true

  after_create_commit -> {
    broadcast_replace_to "recognitions",
      target: "recent_recognitions",
      partial: "recognitions/list",
      locals: { recognitions: Recognition.all.order(created_at: :desc) }
  }
end
