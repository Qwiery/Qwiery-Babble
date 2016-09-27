/***
 * Presents the workspaces aka notebooks.
 */
var WorkspacesComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        return {};
    },
    render: function() {
        return <div id={this.componentId} style={{border:"none","minHeight":"300px" }}></div>;
    },

    adorn: function() {
        var that = this;
        $.when(Qwiery.getSpaces()).then(function(spaces) {
            that.spaces = spaces;
            for(var k = 0; k < spaces.length; k++) {
                var space = spaces[k];
                var $item;

                space.Source = "notebook.png";

                $item = $('<div class="notebook-wall-item"  onClick="UI.ask(\'get:space:' + space.Name + '\')"><span class="fa fa-book" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + space.Name + '</span></div>');
                that.$container.append($item);
                $item.hide();
                that.iso.isotope('appended', $item);
                that.iso.isotope('layout');
                $item.fadeIn(500);
            }
        });
    },
    componentDidUpdate: function() {
        // this.adorn();
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.thought-wall-item',
            masonry: {
                columnWidth: '.thought-wall-item'
            }
        });
        this.adorn();
    }
});
