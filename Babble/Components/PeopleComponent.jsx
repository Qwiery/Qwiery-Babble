/***
 * Presents the people.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <PeopleComponent persons=things/>
 */
var PeopleComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.persons = this.props.persons;
        return {};
    },
    render: function() {
        return <div id={this.componentId} style={{border:"none"}}></div>;
    },
    adorn: function() {
        var that = this;
        $.when(Qwiery.getPeople()).then(function(persons) {
            that.persons = persons;
            $("#" + that.componentId).kendoListView({
                dataSource: that.persons,
                template: kendo.template('<div class="personItem"  onClick="UI.ask(\'get: #=Id#\')"><span class="glyphicon glyphicon-asterisk" style="float: left;margin-right: 5px;"></span><p class="personTitle">#:Title#</p><p class="personDescription">#:Description || ""#</p></div>')
            });
        });
    },
    componentDidUpdate: function() {
        this.adorn();
    },
    componentDidMount: function() {
        this.adorn();
    }
});
