# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "Seeding data..."

users = [
  { name: "Alice Admin", email: "alice@example.com", password: "password" },
  { name: "Bob Builder", email: "bob@example.com", password: "password" },
  { name: "Carol Creator", email: "carol@example.com", password: "password" }
]

users.each do |attrs|
  User.find_or_create_by!(email: attrs[:email]) do |u|
    u.name = attrs[:name]
    u.password = attrs[:password]
  end
end

badges = [
  { name: "Team Player", slug: "team_player" },
  { name: "Innovator", slug: "innovator" },
  { name: "Customer Hero", slug: "customer_hero" },
  { name: "Mentor", slug: "mentor" }
]

badges.each do |attrs|
  Badge.find_or_create_by!(slug: attrs[:slug]) do |b|
    b.name = attrs[:name]
  end
end

if Recognition.count == 0
  alice = User.find_by!(email: "alice@example.com")
  bob = User.find_by!(email: "bob@example.com")
  badge = Badge.first
  Recognition.create!(sender: alice, recipient: bob, badge: badge, message: "Thanks for helping with the release!")
end

puts "Seed complete."
