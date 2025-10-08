class CreateRecognitions < ActiveRecord::Migration[8.0]
  def change
    create_table :recognitions do |t|
      t.references :sender, null: false, foreign_key: { to_table: :users }
      t.references :recipient, null: false, foreign_key: { to_table: :users }
      t.references :badge, null: false, foreign_key: true
      t.text :message

      t.timestamps
    end
  end
end
