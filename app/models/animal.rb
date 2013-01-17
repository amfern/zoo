class Animal < ActiveRecord::Base
  mount_uploader :picture, PictureUploader
  self.per_page = 3
end
