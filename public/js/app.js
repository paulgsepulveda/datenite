var app = new Vue({
  el: '#date',
  data: {
    selectDate: true,
    spinner: false,
    results: false,
    date: ''
  },
  methods: {
    sendRequest: function (dateType, csrf) {
      this.selectDate = false;
      this.spinner = true;
      var currentDate = new Date;
      currentDate = currentDate.toISOString();
      console.log('loltest');
      var that = this;
      axios.post('/api', {
        latitude: null,
        longitude: null,
        date: currentDate,
        zip: '32814',
        date_type: dateType,
        _csrf: csrf
      })
      .then(function (response) {
        that.date = response.data;
        console.log(that.date);
        that.spinner = false;
        that.results = true;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
});



