$(function () {
    var includes = $('[includeFile]')
    $.each(includes, function () {
      var file = $(this).data('include') + '.html'
      $(this).load(file)
    })
  })