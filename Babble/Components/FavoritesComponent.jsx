/***
 * Presents the favorites.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <FavoritesComponent favorites=things/>
 */
var FavoritesComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.favorites = this.props.favorites;

        return {};
    },
    render: function() {
        return <div id={this.componentId} style={{border:"none","min-height":"30px"}}></div>;
    },
    
    adorn: function() {
        var that = this;

        $.when(Qwiery.getFavorites()).then(function(favorites) {
            that.favorites = favorites;
            if(Qwiery.isUndefined(favorites) || favorites.length === 0) {
                that.$container.append("<div>You don't have any favorites right now.</div>");
            }
            else {
                for(var k = 0; k < favorites.length; k++) {
                    var favorite = favorites[k];
                    var $item = $('<div class="favorite-wall-item"  onClick="UI.ask(\'get:' + favorite.Id + '\')"><span class="glyphicon glyphicon-star" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="favorite-title">' + favorite.Title + '</span><p class="favorite-description">' + favorite.Description + '</p></div>');
                    that.$container.append($item);
                    $item.hide();
                    that.iso.isotope('appended', $item);
                    that.iso.isotope('layout');
                    $item.fadeIn(500);
                }
            }

        });
    },
    componentDidUpdate: function() {
        //this.adorn();
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.favorite-wall-item',
            masonry: {
                columnWidth: '.favorite-wall-item'
            }
        });
        this.adorn();
    }
});
