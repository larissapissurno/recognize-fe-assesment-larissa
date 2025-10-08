class Badge < ApplicationRecord
  has_many :recognitions

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
end
