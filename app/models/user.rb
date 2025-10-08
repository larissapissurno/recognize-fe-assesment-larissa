class User < ApplicationRecord
  has_secure_password

  has_many :sent_recognitions, class_name: "Recognition", foreign_key: :sender_id, dependent: :destroy
  has_many :received_recognitions, class_name: "Recognition", foreign_key: :recipient_id, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
end
