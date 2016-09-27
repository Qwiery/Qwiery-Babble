var GraphSummaryComponent = React.createClass({
    getInitialState: function() {
        this.favorites = [];
        this.tags = [];
        this.componentId = Qwiery.randomId();
        return {
            dataLoaded: false
        };
    },

    render: function() {
        if(this.state.dataLoaded) {
            return <div className="lister" id={this.componentId} key={this.componentId}>
                <ul className="list-inline">{this.renderItems(this.favorites)}</ul>
                <ul className="list-inline">{this.renderItems(this.tags)}</ul>
            </div>;
        }
        else {
            return <div className="lister" id={this.componentId} key={this.componentId}>
            </div>;
        }
    },
    renderItems: function(items) {
        var that = this;
        return _.map(items, function(t) {
            var iconClass = "";
            var thetitle = "";
            if(t.Type === "Tag") {
                thetitle = "Tag";
                iconClass = "fa fa-tag TagIcon";
            } else if(t.IsEntity) {
                thetitle = "Entity [" + t.DataType + "]";

                if(t.IsFavorite) {
                    iconClass = "fa fa-star FavoriteIcon";
                } else {
                    iconClass = "fa fa-square EntityIcon";
                }
            } else {
                thetitle = "Entity";
            }

            return <li key={t.Id}><i className={iconClass} ariaHidden="true"></i><a href="#" id={Qwiery.randomId()}
                                                                                    data-type={t.Type}
                                                                                    data-title={t.Title}
                                                                                    data-nodeid={t.NodeId || t.Id}
                                                                                    data-isentity={t.IsEntity}
                                                                                    onClick={UI.handleClick}
                                                                                    data-toggle="popover" title={thetitle}
                                                                                    data-html="true"
                                                                                    className="draggable"
                                                                                    data-content={t.Title}>{t.Title}</a>
            </li>;
        });


    },
    componentDidUpdate: function() {
        $('[data-toggle="popover"]').popover({
            trigger: 'hover',
            'placement': 'top'
        });
        this.fetchData();
    },

    componentDidMount: function() {
        this.fetchData();
    },
    refresh: function() {
        this.tags = [];
        this.favorites = [];
        this.setState({
            visibility: "visible",
            dataLoaded: false
        });
    },
    fetchData: function() {
        if(this.state.dataLoaded)return;
        var that = this;
        $.when(Qwiery.getFavorites(), Qwiery.getTags()).then(function(f, t) {
            var favs = f[0];
            var tags = t[0];
            for(var k = 0; k < favs.length; k++) {
                var fav = favs[k];
                var item = {
                    Id: fav.Id,
                    Title: fav.Title,
                    IsEntity: true,
                    DataType: fav.DataType || "Entity",
                    IsFavorite: true
                };
                that.favorites.push(item);
            }
            for(var k = 0; k < tags.length; k++) {
                var tag = tags[k];
                that.tags.push({
                    Id: tag.Id,
                    Title: tag.Title,
                    IsEntity: true,
                    Type: "Tag",
                    IsFavorite: false
                })
            }
            that.setState({
                dataLoaded: true
            });
        });
    },

    askFor: null,

    addFavorite: function(item) {
        if(this.favorites.length > 10) {
            delete this.favorites[this.favorites.length - 1];
        }
        this.favorites.unshift(item);
        this.setState({
            dataLoaded: true
        });
    },
    removeFavorite: function(id) {
        _.remove(this.favorites, function(r) {
            return r.Id === id;
        });
        this.setState({
            dataLoaded: true
        });
    }
});