class CreateAnimals < ActiveRecord::Migration
  def change
    create_table :animals do |t|
      t.string :category
      t.string :name
      t.integer :count
      t.string :picture

      t.timestamps
    end
  end
end
