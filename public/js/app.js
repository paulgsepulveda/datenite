var app = new Vue({
  el: '#date',
  data: {
    selectDate: true,
    spinner: false,
    results: false,
    userZip: '',
    date_type: '',
    dates: {}
  },
  methods: {
    sendRequest: function (dateType, csrf) {
      this.selectDate = false;
      this.results = false;
      this.spinner = true;
      var currentDate = new Date;
      currentDate = currentDate.toISOString();
      var that = this;
      axios.post('/api', {
        latitude: null,
        longitude: null,
        date: currentDate,
        zip: this.userZip,
        date_type: dateType,
        _csrf: csrf
      })
      .then(function (response) {
        that.dates= response.data;
        that.spinner = false;
        that.results = true;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
});



