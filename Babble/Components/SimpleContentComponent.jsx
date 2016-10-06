/***
 * Presents string and HTML content.
 *
 * <SimpleContentComponent
 */
var SimpleContentComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();

        return {};
    },
    render: function() {

        return <div id={this.componentId}></div>;
    },
    componentDidMount: function() {
        $("#" + this.componentId).html(UI.markdown.render(this.props.content));
        $(".activeThumb").click(function() {
            var img = $(this);

            if (img.width() < 200)
            {
                img.animate({width: "500px"}, 1000);
            }
            else
            {
                img.animate({width: "150px"}, 1000);
            }
        });
    }
});
