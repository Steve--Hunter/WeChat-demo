Page({
  data: {
    list: [
      {
        id: 'play_chinese',
        name: 'Play in Chinese',
        open: false,
        pages: ['view']
      }, {
        id: 'play_english',
        name: 'Play in English',
        open: false,
        pages: ['English']
      }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})
