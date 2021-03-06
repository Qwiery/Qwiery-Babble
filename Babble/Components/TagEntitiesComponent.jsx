/***
 * Presents the entities of a tag.
 */
var TagEntitiesComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.tagName = this.props.Tag;
        return {};
    },
    render: function() {
        return <div id={this.componentId} style={{border:"none"}}></div>;
    },
    adorn: function() {
        var that = this;
        $.when(Qwiery.getTagEntities(this.tagName)).then(function(entities) {
            that.thoughts = entities;
            for(var k = 0; k < entities.length; k++) {
                var thought = entities[k];
                var $item;
                if(!Qwiery.isDefined(thought.Source)) {
                    thought.Source = "cogs.png";
                }
                $item = $('<div class="thought-wall-item"  onClick="UI.ask(\'get:' + thought.Id + '\')"><span class="fa fa-lightbulb-o" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + thought.Title + '</span><img class="thought-image" src="/Uploads/' + thought.Source + '"/><p class="thought-description">' + _.truncate(thought.Description, 60) + '</p></div>');
                that.$container.append($item);
                $item.hide();
                that.iso.isotope('appended', $item);
                that.iso.isotope('layout');
                $item.fadeIn(500);
            }
        });
    },
    componentDidUpdate: function() {
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
