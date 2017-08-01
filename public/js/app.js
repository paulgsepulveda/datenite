var app = new Vue({
  el: '#date',
  data: {
    selectDate: true,
    spinner: false,
    results: false
  },
  methods: {
    sendRequest: function () {
      this.selectDate = false;
      this.results = false;
      this.spinner = true;
      $.ajax({
        type: "post",
        url: "/api",
        data: {
          latitude: null,
          longitude: null,
          date: Date().toISOString(),
          zip: this.location,
          date_type: this.date_type
        },
        dataType: "dataType",
        success: function (response) {
          this.date = response;
          this.spinner = false;
        }
      });
    }
  }
});



