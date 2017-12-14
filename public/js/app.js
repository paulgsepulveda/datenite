var app = new Vue({
  el: '#date',
  data: {
    selectDate: true,
    spinner: false,
    results: false,
    validated: true,
    userZip: '',
    date_type: '',
    dates: {}
  },
  computed: {
    isValidated: function() {
      if(this.userZip.length == 5) {
        this.validated = false;
        return this.validated;
      } {
        this.validated = true;
        return this.validated;
      }
      
    }
  },
  watch: {
  },
  methods: {
    sendRequest: function (dateType, csrf) {
      this.selectDate = false;
      this.results = false;
      this.spinner = true;
      this.date_type = dateType;
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



