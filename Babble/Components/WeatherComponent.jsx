/***
 * A component to present weather info.
 */
var WeatherComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.location = this.props.Location;
        return {};
    },

    render: function() {
        return <div id={this.componentId}>
            <div id="weather"></div>
        </div>;
    },
    componentWillMount: function() {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "/styles/weather.css"
        }).appendTo("head");

    },
    componentDidMount: function() {
        // var html = "<span>Sorry, could not fetch the weather data.</span>";
         var that = this;
        // $.ajax({
        //     url: "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + this.location + "') and u='c'&format=json&jsoncallback=json",
        //     dataType: "jsonp",
        //     headers: {
        //         "Content-type": "application/json",
        //         "Accept": "application/json"
        //     },
        //     timeout: Qwiery.timeout
        // }).fail(function(error) {
        //     $("#" + that.componentId).html(html);
        // }).then(function(data) {
        //
        //     html = "<div>" + data.query.results.channel.item.condition.text + "</div>";
        //     $("#" + that.componentId).html(html);
        // });
        $.getScript("/Babble/scripts/simpleWeather.min.js", function() {
            $.simpleWeather({
                location: that.location,
                woeid: '',
                unit: 'c',
                success: function(weather) {
                    html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
                    html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
                    html += '<li class="currently">' + weather.currently + '</li>';
                    html += '<li>' + weather.wind.direction + ' ' + weather.wind.speed + ' ' + weather.units.speed + '</li></ul>';

                    $("#weather").html(html);
                },
                error: function(error) {
                    $("#weather").html('<p>' + error + '</p>');
                }
            });
        });

    }
});
