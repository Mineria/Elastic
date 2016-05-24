require 'elasticsearch/model'

class Movie
  include Mongoid::Document
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  field :name, type: String
  field :gender, type: String
  field :description, type: String

  def as_indexed_json(options={})
    as_json(only: [:name, :description, :gender])
  end

  mapping do
    indexes :name, type: :string, :analyzer => :english, :boost => 50
    indexes :description, type: :string, :analyzer => :english, :boost => 20
  end

  def self.search(q)
    @result = __elasticsearch__.search(
      query: {
        multi_match: {
          query: q,
          fields:  [ "description" ],
          fuzziness: 1,
          prefix_length: 0
        }
      },
      highlight: {
        fields: {
          description: {
            fragment_size: 100, number_of_fragments: 10
          }
        }
      }
    )

    @result
  end

end
