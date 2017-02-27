import React, {Component} from 'react';
import LeftMenuContent from '../leftmenuPusherContent/leftmenuContent';
import {
    Sidebar,
    Segment,
    Image,
    Icon,
    Menu,
    Popup,
    Label,
    Dropdown
} from 'semantic-ui-react';
import Axios from 'axios';
import Cookie from 'react-cookie';
import {hashHistory} from 'react-router';
import './leftmenu.css';
import LeftMenuPage from '../../../Multi_Lingual/Wordings.json';
export default class LeftMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'Build',
            details: '',
            email: '',
            firstname: '',
            lastname: '',
            usertype: false,
            name: '',
            photo: '',
            counter: 0
        };
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.getNotificationCount = this.getNotificationCount.bind(this);
        this.getUserInformation = this.getUserInformation.bind(this);
    }
    handleItemClick = ((e, {name}) => {
        if (this.state.activeItem === 'notifications') {
            let url = '/getbroadcastmessage/updateCount';
            this.state.counter = 0;
            Axios.post(url).then((response) => {}).catch((error) => {
                console.log(error);
            });
        }
        this.setState({activeItem: name, counter: this.state.counter});
    });
    componentDidMount() {
        this.getUserInformation();
        this.getNotificationCount();
        let socket = io();
        socket.on('update label', (data) => {
            this.state.counter = this.state.counter + 1;
            this.setState({counter: this.state.counter});
        });
    }
    getNotificationCount() {
        let url = '/getbroadcastmessage/count';
        Axios.get(url).then((response) => {
            this.setState({counter: response.data.count});
        }).catch((error) => {
            console.log(error);
        });
    }
    // to fetch the information about the user
    getUserInformation() {
        let self = this;
        Axios({
          url: '/userProfile',
          method: 'GET',
          data: 'json'}).then(function(response) {
            let authType = Cookie.load('authType');
            if (authType === 'facebook') {
                self.setState({name: response.data.user.facebook.displayName,
                  email: response.data.user.facebook.email,
                  photo: response.data.user.facebook.photos, usertype: false});
            } else if (authType === 'google') {
                self.setState({name: response.data.user.google.name,
                  email: response.data.user.google.email,
                  photo: response.data.user.google.photos, usertype: false});
            } else if (authType === 'local') {
                self.setState({name: response.data.user.local.name,
                email: response.data.user.local.email,
                photo: response.data.user.local.photos, usertype: true});
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    onSubmitEmail() {
        hashHistory.push('/profile');
    }
    // redirects to changepassword page
    onChangePassword() {
        hashHistory.push('/change');
    }
    render() {
        const activeItem = this.state.activeItem;
        const customername = this.state.name;
        let trigger;
        let authType = Cookie.load('authType');
        if (authType === 'local') {
            let profilepicture = Cookie.load('profilepicture');
            trigger = (
                <span>
                    <Image avatar src={require('../../../../webserver/images/' + profilepicture)}/>
                    {name = customername}
                </span>
            );
        } else if (authType === 'facebook') {
            trigger = (
                <span>
                    <Image avatar src={this.state.photo}/>
                    {name = customername}
                </span>
            );
        } else if (authType === 'google') {
            trigger = (
                <span>
                    <Image avatar src={this.state.photo}/>
                     {name = customername}
                </span>
            );
        }
        return (
            <div id="leftbarmenu">
                <Sidebar as={Menu} className='fixed' animation='slide along' width='thin'
                   visible={true} icon='labeled' vertical inverted>
                    <Menu.Item name='Genie' active={activeItem === 'Genie'}
                      onClick={this.handleItemClick}>
                        <a href="#/clienthome">
                            <Image src='../../images/ginianim.gif' size='tiny' avatar/></a>
                    </Menu.Item>
                    <Menu.Item name='Home' active={activeItem === 'Home'}
                      onClick={this.handleItemClick}>
                        <Icon name='home' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu1}
                    </Menu.Item>
                    <Menu.Item name='ChatBot' active={activeItem === 'ChatBot'}
                      onClick={this.handleItemClick}>
                        <Icon name='discussions' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu2}
                    </Menu.Item>
                    <Menu.Item name='Bookmarks' active={activeItem === 'Bookmarks'}
                      onClick={this.handleItemClick}>
                        <Icon name='save' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu3}
                    </Menu.Item>
                    <Menu.Item name='notifications' active={activeItem === 'notifications'}
                      onClick={this.handleItemClick}>
                        <Label color='red' floating-left>{this.state.counter}</Label>
                        <Icon name='alarm' color='teal'/>
                        {LeftMenuPage.LeftMenu.Menu4}
                    </Menu.Item>
                    <Menu.Item name='LogOut' active={activeItem === 'LogOut'}
                      onClick={this.handleItemClick}>
                        <Icon name='sign out' color='teal'/>
                        <a href='#/logout'>{LeftMenuPage.LeftMenu.Menu5}</a>
                    </Menu.Item>
                </Sidebar>
                <Sidebar.Pusher id="sidebarpusher">
                    <Segment id="segmentleftbar">
                        <div id='topmenudiv'>
                            <Menu secondary>
                                <Menu.Item>
                                    <a href="#/clienthome">
                                        <Popup trigger={< Icon name = "arrow circle left"
                                          size = "large" circular color = 'black' />}
                                          content='Back' size='mini'/>
                                    </a>
                                </Menu.Item>
                                <Menu.Item position='right' />
                                <Menu.Item/><Menu.Item/>
                                <Menu.Item>
                                    <h3>{LeftMenuPage.LeftMenu.Heading}</h3>
                                </Menu.Item>
                                <Menu.Item position='right'>
                                    <Dropdown trigger={trigger} pointing='top right' icon={null}>
                                        <Dropdown.Menu >
                                            <Dropdown.Item text='Edit Profile' icon='user'
                                              disabled={(!this.state.usertype)}
                                              onClick={this.onSubmitEmail}/>
                                            <Dropdown.Item text='Change Password' icon='lock'
                                              disabled={(!this.state.usertype)}
                                              onClick={this.onChangePassword}/>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu.Item>
                            </Menu>
                        </div>
                        <div id='leftmenucontentdiv'>
                            <LeftMenuContent sidebarItemSelected={activeItem}/>
                        </div>
                    </Segment>
                </Sidebar.Pusher>
            </div>
        );
    }
}
