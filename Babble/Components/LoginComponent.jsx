/***
 * Handles everything login and social connection.
 *
 * <LoginComponent />
 */
var LoginComponent = React.createClass({
    getInitialState: function() {
        this.componentId = Qwiery.randomId();
        hello.init({
            facebook: "362829230511744",
            twitter: "G69pUBd0yMSyNRCNxfckhw",
            google: "899171813633-bi89u7skhq05atrssbsp1j4rsvkhgtk6.apps.googleusercontent.com"
        });

        this.cookie = Cookies.get(UI.constants.CookieName);
        if(Qwiery.isDefined(this.cookie)) {
            var cookieContent = JSON.parse(this.cookie);
            // the Anonymous cannot be considered as authenticated, more sorta pseudo-user
            if(cookieContent.userId !== "Anonymous") {
                this.currentUser = cookieContent;
            }
        } else {
            this.currentUser = null;
        }

        this.localCredentials = {email: null, password: null};
        if(Qwiery.isUndefined(this.currentUser) || this.currentUser.id === "Anonymous") {
            return {local: "login"};
        } else {
            if(Qwiery.isDefined(this.currentUser.local)) {
                return {local: "loggedin"};
            } else {
                return {local: "register"};
            }
        }
    },

    componentDidMount: function() {
        if(Qwiery.isDefined(this.currentUser)) {
            $("#globalLoggedInInfo").show();
        } else {
            $("#globalLoggedInInfo").hide();
        }
        this.refresh();
        $("#emailBox").focus();
    },

    componentDidUpdate: function() {
        this.refresh();
    },

    handleChange: function(event) {
        if(event.target.id === "emailBox" || event.target.id === "registerEmailBox") {
            this.localCredentials.email = event.target.value;
        } else {
            this.localCredentials.password = event.target.value;
        }

        this.setState({});
    },

    loginKeyUp: function(event) {
        if(event.charCode === 13) {
            this.connectLocal();
        }
    },

    render: function() {

        var localSection = null;
        var localLogin = <div id="localLogin">
            <div className="panel panel-success">
                <div className="panel-heading">
                    <h3 className="panel-title">Local Login</h3>
                </div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-md-4" style={{"margin": "5px 0 0 0"}}>
                            <label htmlFor="emailBox" style={{"width": "90px"}}>Email:</label>
                            <input type="text" id="emailBox" value={this.localCredentials.email}
                                   keyUp={this.loginKeyUp} onChange={this.handleChange}/>
                        </div>
                        <div className="col-md-4" style={{"margin": "5px 0 10px 0"}}><label htmlFor="passwordBox"
                                                                                            style={{"width": "90px"}}>Password:</label>
                            <input type="password" value={this.localCredentials.password} id="passwordBox"
                                   onChange={this.handleChange} onKeyPress={this.loginKeyUp}/></div>
                        <div className="col-md-3">
                            <button onClick={this.connectLocal} className="btn btn-success">Login</button>
                            <span style={{"margin": "0 10px"}}>or</span>
                            <button onClick={this.showLocalRegister} className="btn btn-primary">Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
        var localRegister = <div id="registerLocal">
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title">Local Register</h3>
                </div>
                <div className="panel-body">
                    <p>Note that if you are already connected with a social network this will add a local
                        account with
                        which you can connect.</p>

                    <div className="row">
                        <div className="col-md-3">
                            <label htmlFor="registerEmailBox">Email:</label>
                            <input type="text" id="registerEmailBox" onChange={this.handleChange}
                                   value={this.localCredentials.email}/>
                        </div>
                        <div className="col-md-4"><label htmlFor="registerPasswordBox">Password:</label>
                            <input type="password" id="registerPasswordBox" onChange={this.handleChange}
                                   value={this.localCredentials.password}/></div>
                        <div className="col-md-3">
                            <button onClick={this.localCancelRegister} className="btn btn-default">Cancel
                            </button>
                            <button onClick={this.registerLocal} className="btn btn-primary">Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
        if(UI.constants.EnableLocalLogin) {
            switch(this.state.local) {
                case "login":
                    localSection = localLogin;
                    break;
                case "register":
                    localSection = localRegister;
                    break;
                case "loggedin":
                    localSection = null;
                    break;
            }
        } else {
            localSection = null;
        }

        return <div id={this.componentId} key={this.componentId}>
            <div id="globalLoggedInInfo" style={{"display": "none"}}>
                <div className="panel panel-success">
                    <div className="panel-heading">
                        <h3 className="panel-title">Logged in</h3>
                    </div>
                    <div className="panel-body">
                        <label htmlFor="apiKey">API key:</label>

                        <div id="apiKey"></div>
                        <button style={{"margin": "10px 0 0 0"}} className="btn btn-warning" id="logoffButton"
                                onClick={this.logoff}>Logoff
                        </button>
                    </div>
                </div>
            </div>
            <div id="localSection">
                <div id="localDetails" style={{"display": "none"}}>
                    <div className="panel panel-success">
                        <div className="panel-heading">
                            <h3 className="panel-title">Local Details</h3>
                        </div>
                        <div className="panel-body">
                            <label htmlFor="email">Email:</label>

                            <div id="email"></div>
                        </div>
                    </div>
                </div>
                {localSection}
            </div>
            <div id="facebookSection">
                <div id="facebookDetails" className="panel panel-success">
                    <div className="panel-heading">
                        <h3 className="panel-title">Facebook details</h3>
                    </div>
                    <div className="panel-body">
                        <div id="facebookInfo"></div>
                    </div>
                </div>
                <div id="facebookLogin" className="panel panel-success">
                    <div className="panel-heading">
                        <h3 className="panel-title">Facebook login</h3>
                    </div>
                    <div className="panel-body">
                        <p>You can connect via Facebook but please note that you will create multiple accounts if you
                            already
                            have a local account or one using another social network.</p>

                        <p>If you are already logged in then you can add Facebook as another way to connect with this
                            site.</p>
                        <button id="facebookButton" className="zocial facebook"
                                style={{"border": "none", "backgroundImage": "none"}}
                                onClick={this.connectFacebook}>Facebook
                        </button>
                    </div>
                </div>
            </div>
            <div id="googleSection">
                <div id="googleDetails" className="panel panel-success">
                    <div className="panel-heading">
                        <h3 className="panel-title">Google details</h3>
                    </div>
                    <div className="panel-body">
                        <div id="googleInfo"></div>
                    </div>
                </div>
                <div id="googleLogin" className="panel panel-success">
                    <div className="panel-heading">
                        <h3 className="panel-title">Google login</h3>
                    </div>
                    <div className="panel-body">
                        <p>You can connect via Google but please note that you will create multiple accounts if you
                            already have
                            a local account or one using another social network.</p>

                        <p>If you are already logged in then you can add Facebook as another way to connect with this
                            site.</p>
                        <button id="fgoogleButton" className="zocial google"
                                style={{"border": "none", "backgroundImage": "none"}}
                                onClick={this.connectGoogle}>Google
                        </button>
                    </div>
                </div>
            </div>

            <div id="twitterSection">
                <div id="twitterDetails" className="panel panel-success">
                    <div className="panel-heading">
                        <h3 className="panel-title">Twitter details</h3>
                    </div>
                    <div className="panel-body">
                        <div id="twitterInfo"></div>
                    </div>
                </div>
                <div id="twitterLogin" className="panel panel-success">
                    <div className="panel-heading">
                        <h3 className="panel-title">Twitter login</h3>
                    </div>
                    <div className="panel-body">
                        <p>You can connect via Twitter but please note that you will create multiple accounts if you
                            already have
                            a local account or one using another social network.</p>

                        <p>If you are already logged in then you can add Facebook as another way to connect with this
                            site.</p>
                        <button id="ftwitterButton" className="zocial twitter"
                                style={{"border": "none", "backgroundImage": "none"}}
                                onClick={this.connectTwitter}>Twitter
                        </button>
                    </div>
                </div>
            </div>
        </div>;
    },

    refresh: function() {
        $("#globalLoggedInInfo").hide();
        this.localLogic();
        this.facebookLogic();
        this.googleLogic();
        this.twitterLogic();
        if(Qwiery.apiKey !== "Anonymous") {
            UI.refreshPods();
        }
    },

    localLogic: function() {

        if(this.currentUser === null || this.currentUser.id === "Anonymous") {
            $("#localDetails").hide();
        } else {
            $("#globalLoggedInInfo").show();
            $("#apiKey").html(this.currentUser.apiKey);
            if(this.currentUser.local && UI.constants.EnableLocalLogin) {
                $("#localDetails").show();
                $("#email").html(this.currentUser.local.email);
            } else {
                $("#localDetails").hide();
            }
        }
    },

    facebookLogic: function() {
        if(Qwiery.isUndefined(this.currentUser)) {
            $("#facebookDetails").hide();
            $("#facebookLogin").show();
        } else {
            if(Qwiery.isDefined(this.currentUser.facebook)) {
                $("#facebookDetails").show();
                $("#facebookLogin").hide();
                this.getFacebookDetails();
            } else {
                $("#facebookDetails").hide();
                $("#facebookLogin").show();
            }
        }
    },

    googleLogic: function() {
        if(Qwiery.isUndefined(this.currentUser)) {
            $("#googleDetails").hide();
            $("#googleLogin").show();
        } else {
            if(Qwiery.isDefined(this.currentUser.google)) {
                $("#googleDetails").show();
                $("#googleLogin").hide();
                this.getGoogleDetails();
            } else {
                $("#googleDetails").hide();
                $("#googleLogin").show();
            }
        }
    },

    twitterLogic: function() {
        if(Qwiery.isUndefined(this.currentUser)) {
            $("#twitterDetails").hide();
            $("#twitterLogin").show();
        } else {
            if(Qwiery.isDefined(this.currentUser.twitter)) {
                $("#twitterDetails").show();
                $("#twitterLogin").hide();
                this.getTwitterDetails();
            } else {
                $("#twitterDetails").hide();
                $("#twitterLogin").show();
            }
        }
    },

    /***
     * This updates the cookie and sets the API key so from now on all
     * requests to Qwiery are authenticated.
     * @param obj the authentication ticket.
     */
    updateClientCredentials: function(obj) {
        if(obj.twitter){
            // when trying to set the cookie there seems to be an issue with these substructures
            delete obj.twitter.status;
            delete obj.twitter.entities;
        }
        var ticket = JSON.stringify(obj);
        Cookies.set(UI.constants.CookieName, ticket, {expires: 7});
        UI.ticket = obj;
        UI.setAvatar();
        Qwiery.apiKey = obj.apiKey;
    },

    /***
     * Removes all client credentials and makes the client anonymous.
     */
    logoff: function() {
        Cookies.remove(UI.constants.CookieName);
        hello.logout();
        this.cookie = null;
        this.currentUser = null;
        Qwiery.apiKey = "Anonymous";
        UI.removeAvatar();
        this.setState({
            local: "login"
        });
    },

    showLocalRegister: function() {
        $("#localDetails").hide();
        this.setState({
            local: "register"
        });
    },

    localCancelRegister: function() {
        this.setState({
            local: "login"
        });
        $("#localDetails").hide();
    },

    /***
     * Login with local credentials.
     * This does not register the user, use the registerLocal for this.
     */
    connectLocal: function() {
        var email = $("#emailBox").val().trim();
        var password = $("#passwordBox").val().trim();
        if(email.length === 0) {
            UI.showError("No email address specified.");
            return;
        }
        if(password.length === 0) {
            UI.showError("No password specified.");
            return;
        }
        var that = this;
        $.when(Qwiery.connectLocal(email, password))
            .then(function(r) {

                if(Qwiery.isDefined(r.error)) {
                    UI.showError(r.error);
                } else {
                    that.currentUser = {
                        local: r.local,
                        apiKey: r.apiKey,
                        facebook: r.facebook,
                        google: r.google,
                        twitter: r.twitter
                    };
                    that.updateClientCredentials(that.currentUser);
                    that.setState({
                        local: "loggedin"
                    });
                }
            })
            .fail(function(err) {
                UI.showError(err);
            });
    },

    /***
     * Connect with new credentials.
     * If already connected with other methods (e.g. Facebook) the accounts will be merged.
     */
    registerLocal: function() {
        var email = $("#registerEmailBox").val().trim();
        var password = $("#registerPasswordBox").val().trim();
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.local)) {
            UI.showError("There already is a local account...this should not happen.");
            return;
        }
        if(email.length === 0) {
            UI.showError("No email address specified.");
            return;
        }
        if(password.length === 0) {
            UI.showError("No password specified.");
            return;
        }
        var that = this;
        $.when(Qwiery.registerLocal(email, password, this.currentUser)).then(function(r) {
            if(Qwiery.isDefined(r.error)) {
                UI.showError(r.error);
            } else {
                that.currentUser = {
                    local: r.local,
                    apiKey: r.apiKey,
                    facebook: r.facebook,
                    google: r.google,
                    twitter: r.twitter
                };
                that.updateClientCredentials(that.currentUser);
                that.setState({
                    local: "loggedin"
                });
            }
        }).fail(function(err) {
            UI.showError(err);
        });
    },

    /***
     * Connects with Facebook credentials.
     * If the user has other accounts they will be merged.
     */
    connectFacebook: function() {
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.facebook)) {
            UI.showError("No need to login with Facebook, you already are known. This should not happen really.");
            return;
        }
        var that = this;
        hello('facebook').login().then(function(e) {
            hello('facebook').api('/me').then(function(facebookObject) {
                $.when(Qwiery.connectFacebook(facebookObject, that.currentUser))
                    .then(function(newUser) {
                        if(Qwiery.isDefined(newUser.error)) {
                            UI.showError(newUser.error);
                        } else {
                            that.currentUser = newUser;
                            that.updateClientCredentials(that.currentUser);

                            if(Qwiery.isDefined(that.currentUser.local)) {
                                that.setState({
                                    local: "loggedin"
                                });
                            } else {
                                that.setState({
                                    local: "register"
                                });
                            }

                        }
                    })
                    .fail(function(err) {
                        UI.showError(err);
                    });
            });
        });
    },

    /***
     * Presents the Facebook details
     */
    getFacebookDetails: function() {
        $("#facebookInfo").html('<img src="' + this.currentUser.facebook.picture + '" /> Hello ' + this.currentUser.facebook.name);
        $("#facebookDetails").show();
        $("#facebookLogin").hide();
    },

    /***
     * Connects with Google credentials.
     * If the user has other accounts they will be merged.
     */
    connectGoogle: function() {
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.google)) {
            UI.showError("No need to login with Google, you already are known. This should not happen really.");
            return;
        }
        var that = this;
        hello('google').login().then(function(e) {
            hello('google').api('/me').then(function(googleObject) {
                $.when(Qwiery.connectGoogle(googleObject, that.currentUser))
                    .then(function(newUser) {
                        if(Qwiery.isDefined(newUser.error)) {
                            UI.showError(newUser.error);
                        } else {
                            that.currentUser = newUser;
                            that.updateClientCredentials(that.currentUser);
                            if(Qwiery.isDefined(that.currentUser.local)) {
                                that.setState({
                                    local: "loggedin"
                                });
                            } else {
                                that.setState({
                                    local: "register"
                                });
                            }
                        }
                    })
                    .fail(function(err) {
                        UI.showError(err);
                    });
            });
        });
    },

    /***
     * Presents the Google details
     */
    getGoogleDetails: function() {
        $("#googleInfo").html('<img src="' + this.currentUser.google.picture + '" /> Hello ' + this.currentUser.google.name);
        $("#googleDetails").show();
        $("#googleLogin").hide();
    },

    /***
     * Connects with Twitter credentials.
     * If the user has other accounts they will be merged.
     *
     * Note that Hello.js seems to need registration at https//auth-server.herokuapp.com.
     * For this reason it's disabled by default.
     */
    connectTwitter: function() {
        if(Qwiery.isDefined(this.currentUser) && Qwiery.isDefined(this.currentUser.twitter)) {
            UI.showError("No need to login with Twitter, you already are known. This should not happen really.");
            return;
        }
        var that = this;
        hello('twitter').login()
        //    .then(console.log.bind(console), console.error.bind(console));
        .then(function(e) {
            hello('twitter').api('/me').then(function(twitterObject) {
                $.when(Qwiery.connectTwitter(twitterObject, that.currentUser))
                    .then(function(newUser) {
                        if(Qwiery.isDefined(newUser.error)) {
                            UI.showError(newUser.error);
                        } else {
                            that.currentUser = newUser;
                            that.updateClientCredentials(that.currentUser);
                            if(Qwiery.isDefined(that.currentUser.local)) {
                                that.setState({
                                    local: "loggedin"
                                });
                            } else {
                                that.setState({
                                    local: "register"
                                });
                            }
                        }
                    })
                    .fail(function(err) {
                        UI.showError(err);
                    });
            });
        });
    },

    /***
     * Presents the Twitter details
     */
    getTwitterDetails: function() {
        $("#twitterInfo").html('<img src="' + this.currentUser.twitter.thumbnail + '" /> Hello ' + this.currentUser.twitter.name);
        $("#twitterDetails").show();
        $("#twitterLogin").hide();
    }
});