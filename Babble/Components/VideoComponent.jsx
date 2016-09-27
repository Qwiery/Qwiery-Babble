/***
 * A component to present video content.
 */
var VideoComponent = React.createClass({

    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    // <video id="thevideo" width="670" height="377" autoplay="true" controls="controls">
    //     <source src="" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'/>
    // </video>
    render: function() {
        return <div id={this.componentId}>
            <iframe id="thevideo" width="560" height="315" src="" frameborder="0" allowfullscreen></iframe>
        </div>
    },

    componentDidMount: function() {
        //$("#thevideo" + " > source").attr("src", this.props.entity.Url);
        $("#thevideo").attr("src", this.props.entity.Url);
    }
});