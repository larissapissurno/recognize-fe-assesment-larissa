class CreateBadges < ActiveRecord::Migration[8.0]
  def change
    create_table :badges do |t|
      t.string :name
      t.string :slug

      t.timestamps
    end
    add_index :badges, :slug, unique: true
  end
end
