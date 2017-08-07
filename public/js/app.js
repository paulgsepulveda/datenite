var app = new Vue({
  el: '#date',
  data: {
    selectDate: true,
    spinner: false,
    results: false,
    userZip: '',
    date_type: '',
    name: '',
    address: '',
    source: '',
    rating: '',
    reviews: '',
    site_link: ''
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
        zip: this.userZip,
        date_type: dateType,
        _csrf: csrf
      })
      .then(function (response) {
        that.date_type = response.data.date_type;
        that.name = response.data.details.name;
        that.address = response.data.details.address;
        that.rating = '/yelp/regular_' + response.data.details.rating + '.png';
        that.reviews = response.data.details.reviews;
        that.site_link = response.data.details.site_link;
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



