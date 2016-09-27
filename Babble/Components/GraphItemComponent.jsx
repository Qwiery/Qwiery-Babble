/***
 * Presents a graph item.
 *
 * <GraphItemComponent/>
 */
var GraphItemComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.page = this.props.Page;
        this.items = this.props.Other;
        this.pageName = this.props.PageName;
        return {};
    },
    render: function() {
        // $.ajax({dataType: "jsonp", url: "https://en.wikipedia.org/w/api.php?action=query&titles=" + pageName + "&prop=pageimages&format=json&pithumbsize=500"}).then(function(r) {
        //     try {
        //         var imageUrl = r.query.pages[Object.keys(r.query.pages)[0]].thumbnail.source;
        //         container.append("<img src='" + imageUrl + "'/>");
        //     } catch(e) {
        //
        //     }
        //     container.append("<ul>");
        //     _.forEach(page, function(v, k) {
        //         k = k.replace(/_/gi, "");
        //         if(v.indexOf("plainlist") > 0) {
        //
        //         } else {
        //             container.append("<li><strong>" + k + "</strong>: " + v + "</li>")
        //         }
        //     });
        //     container.append("</ul>");
        // })
        var seq = [];
        if(Qwiery.isDefined(this.props.Title) && this.props.Title.length > 0) {
            if(Qwiery.isDefined(this.props.Url) && this.props.Url.length > 0) {
                seq.push(<div ><strong><a href={this.props.Url} target="_blank">{this.props.Title}</a></strong></div>);
            }
            else {
                seq.push(<div >
                    <strong className="clickable" data-type="SingleEntity" data-title={this.props.Title} data-nodeid={this.props.Id} data-isentity="true" onClick={UI.handleClick}>{this.props.Title}</strong></div>);
            }
        }
        if(Qwiery.isDefined(this.props.Description) && this.props.Description.length > 0) {
            seq.push(<div>{this.props.Description}</div>);
        }
        if(Qwiery.isDefined(this.props.ImageSource) && this.props.ImageSource.length > 0) {
            seq.push(<img style={{width:400}} src={this.props.ImageSource}/>);
        }
        return <div id={this.componentId} className="GraphItem"><i className="fa fa-share-alt iconfix"></i>{seq}</div>;


    },

    componentDidMount: function() {

    }
});
