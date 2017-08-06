var app = new Vue({
  el: '#date',
  data: {
    selectDate: true,
    spinner: false,
    results: false,
    date_type: '',
    name: '',
    address: '',
    source: ''
  },
  methods: {
    sendRequest: function (dateType, csrf) {
      this.selectDate = false;
      this.spinner = true;
      var currentDate = new Date;
      currentDate = currentDate.toISOString();
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
        that.date_type = response.data.date_type;
        that.name = response.data.details.name;
        that.address = response.data.details.address;
        that.rating = response.data.details.rating;
        that.reviews = response.data.details.reviews;
        // Property below will be used later to identify the tag to enter
        that.source = response.data.details.source;
        that.spinner = false;
        that.results = true;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
});



