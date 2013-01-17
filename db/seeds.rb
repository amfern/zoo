# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Animal.destroy_all

seed = YAML.load(File.open("#{Rails.root}/config/animals.yml"))
seed['animals'].each {
  |animal| Animal.create animal.merge({:picture => open("#{Rails.root}/public/images.jpeg")})
}