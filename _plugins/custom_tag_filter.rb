module Jekyll
  module CustomTagFilter
    def tag_array(array)
      connector = ","
      case array.length
        when 0
          ""
        when 1
          "<span class=\"label label-default\">#{ array[0].to_s}</span>"
        else
          "<span class=\"label label-default\">#{array.join('</span> <span class="label label-default">')}</span>"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::CustomTagFilter)
