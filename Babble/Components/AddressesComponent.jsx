/***
 * Presents the addresses.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <AddressesComponent addresss=things/>
 */
var AddressesComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.addresss = this.props.addresss;
        return {};
    },
    render: function() {
        return <div id={this.componentId} style={{border: "none"}}>
            <div id="nothing">You have not added any addresses yet. Try for example:
                <blockquote>
                    Add address: Peter's Club
                </blockquote>
            </div>
            <div id="iso"></div>
        </div>;
    },
    adorn: function() {
        var that = this;
        $.when(Qwiery.getAddresses()).then(function(addresses) {
            that.addresss = addresses;
            if(Qwiery.isUndefined(addresses) || addresses.length === 0) {
                $("#nothing").show();
                $("#iso").hide();
            } else {
                $("#nothing").hide();
                $("#iso").show();
                for(var k = 0; k < addresses.length; k++) {
                    var address = addresses[k];
                    var $item;
                    if(Qwiery.isDefined(address.Source)) {
                        $item = $('<div class="thought-wall-item"  onClick="UI.ask(\'get:' + address.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + address.Title + '</span><img class="thought-image" src="' + Qwiery.serviceURL + '/Uploads/' + address.Source + '"/><p class="thought-description">' + address.Description + '</p></div>');
                    } else {
                        $item = $('<div class="thought-wall-item"  onClick="UI.ask(\'get:' + address.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="thought-title">' + address.Title + '</span><p class="thought-description">' + address.Description + '</p></div>');
                    }

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
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#iso");
        this.iso = this.$container.isotope({
            itemSelector: '.thought-wall-item',
            masonry: {
                columnWidth: '.thought-wall-item'
            }
        });
        this.adorn();
    }
});
