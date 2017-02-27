import React, {Component} from 'react';
import Content from '../sideBarPusherContent/content';
import {
    Sidebar,
    Segment,
    Menu,
    Image,
    Icon
  } from 'semantic-ui-react';
import './menu.css';
import TopMenuBot from './topmenubot';
import AdminMenu from '../../../Multi_Lingual/Wordings.json';
export default class SidebarBot extends Component {
    constructor() {
        super();
        this.state = {
            activeItem: 'SetupAi'
        };
    }
    handleItemClick = (e, {name}) => this.setState({activeItem: name})
    render() {
        const activeItem = this.state.activeItem;
        return (
            <div style={{
                height: '100%'
            }}>
                <Sidebar as={Menu} className='fixed' animation='slide along'
                  width='thin' visible={true} icon='labeled' vertical inverted>
                    <Menu.Item name='Genie'>
                        <a href="/home"><Image src='../../images/ginianim.gif'
                        size='tiny' avatar/></a>
                    </Menu.Item>
                    <Menu.Item name='SetupAi' active={activeItem === 'SetupAi'}
                      onClick={this.handleItemClick}>
                        <Icon name='book' color='teal'/>
                        {AdminMenu.AdminMenu.Topic1}
                    </Menu.Item>
                    <Menu.Item name='BroadCast' active={activeItem === 'BroadCast'}
                      onClick={this.handleItemClick}>
                        <Icon name='announcement' color='teal'/>
                        {AdminMenu.AdminMenu.Topic2}
                    </Menu.Item>
                    <Menu.Item name='Users' active={activeItem === 'Users'}
                      onClick={this.handleItemClick}>
                        <Icon name='users' color='teal'/>
                        {AdminMenu.AdminMenu.Topic3}
                    </Menu.Item>
                    <Menu.Item name='Analyze' active={activeItem === 'Analyze'}
                      onClick={this.handleItemClick}>
                        <Icon name='spy' color='teal'/>
                        {AdminMenu.AdminMenu.Topic4}
                    </Menu.Item>
                    <Menu.Item name='TrainBot' active={activeItem === 'UseTheBot'}
                      onClick={this.handleItemClick}>
                        <Icon name='child' color='teal'/>
                        {AdminMenu.AdminMenu.Topic5}
                    </Menu.Item>
                  <Menu.Item name='Unanswered Queries' active={activeItem === 'Unanswered Queries'}
                      onClick={this.handleItemClick}>
                        <Icon name='help' color='teal'/>
                        {AdminMenu.AdminMenu.Topic6}
                    </Menu.Item>
                    <Menu.Item name='LogOut'>
                        <Icon name='sign out' color='teal'/>
                        <a href='#/log'>{AdminMenu.AdminMenu.Topic7}</a>
                    </Menu.Item>
                </Sidebar>
                <Sidebar.Pusher className='container' style={{
                    width: '90%',
                    height: '90%'
                }}>
                    <Segment style={{
                        marginTop: '0px',
                        padding: '0px',
                        height: '100%'
                    }}>
                        <TopMenuBot/>
                        <div style={{
                            'background-color': '#f3f2f2 ',
                            height: '100%'
                        }}>
                            <Content sidebarItemSelected={activeItem}/>
                        </div>
                    </Segment>
                </Sidebar.Pusher>
            </div>
        );
    }
}
