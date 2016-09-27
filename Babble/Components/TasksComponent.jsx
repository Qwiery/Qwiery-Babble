/***
 * Presents the tasks.
 * var things = [
 {
           "Title": "Task 1",
           "Description": "",
           "Id": "9cd3ee05-7612-441d-b780-7dba087f4011",
 }
 *
 * ]
 * <TasksComponent tasks=things/>
 */
var TasksComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        this.tasks = this.props.tasks;

        return {};
    },
    render: function() {
        return <div id={this.componentId} style={{border:"none"}}></div>;
    },
    
    adorn: function() {
        var that = this;
        if(Qwiery.isDefined(this.tasks)) {
            that.presentThem(this.tasks);
        } else {
            $.when(Qwiery.getTasks()).then(function(tasks) {
                that.tasks = tasks;
                that.presentThem(tasks);
            });
        }

    },
    presentThem: function(tasks) {

        for(var k = 0; k < tasks.length; k++) {
            var task = tasks[k];
            var $item;
            if(task.Type === "Workflow") {
                $item = $('<div class="task-wall-item"  onClick="UI.ask(\'run:workflow:' + task.Id + '\', false)"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="task-title">' + task.Title + '</span><p class="task-description">' + task.Description + '</p></div>');
            } else {
                if(Qwiery.isDefined(task.Source)) {
                    $item = $('<div class="task-wall-item"  onClick="UI.ask(\'get:' + task.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="task-title">' + task.Title + '</span><img class="task-image" src="' + Qwiery.serviceURL + '/Uploads/' + task.Source + '"/><p class="task-description">' + task.Description + '</p></div>');
                } else {
                    $item = $('<div class="task-wall-item"  onClick="UI.ask(\'get:' + task.Id + '\')"><span class="glyphicon glyphicon-leaf" style="font-size:15px; float: left;margin-right: 5px;"></span><span class="task-title">' + task.Title + '</span><p class="task-description">' + task.Description + '</p></div>');
                }
            }


            this.$container.append($item);
            $item.hide();
            this.iso.isotope('appended', $item);
            this.iso.isotope('layout');
            $item.fadeIn(500);
        }
        //that.iso.isotope('layout');
    },
    componentDidUpdate: function() {
        //this.adorn();
        this.iso.isotope('layout');
    },
    componentDidMount: function() {
        this.$container = $("#" + this.componentId);
        this.iso = this.$container.isotope({
            itemSelector: '.task-wall-item',
            masonry: {
                columnWidth: '.task-wall-item'
            }
        });
        this.adorn();
    }
});
