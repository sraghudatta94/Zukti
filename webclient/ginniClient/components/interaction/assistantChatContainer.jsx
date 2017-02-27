import React from 'react';
import ReactDOM from 'react-dom';
import {Scrollbars} from 'react-custom-scrollbars';
import InputUserMessage from './inputUserMessage';
import {Menu, Icon, Input, Dimmer, Loader} from 'semantic-ui-react';
import Cookie from 'react-cookie';
import Axios from 'axios';
import AssistantGinniMixedReply from './assistantGinniMixedReply';
import AssistantGinniPlainText from './assistantGinniPlainText';
import AssistantGinniKeywordResponse from './assistantGinniKeywordResponse';
import AssistantUserView from './assistantUserView';
import './chatcontainerstyle.css';
export default class AssistantChatContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            username: 'User',
            loaderActive: true,
            profilePicture: ''
        };
        this.retriveChat = this.retriveChat.bind(this);
        // to display ginni messages
        this.pushGinniMessages = this.pushGinniMessages.bind(this);
        // to display user messages
        this.pushUserMessages = this.pushUserMessages.bind(this);
    }
    componentDidMount() {
        // Scroll to the bottom on initialization
        let username = Cookie.load('username');
        let authType = Cookie.load('authType');
        if (authType === 'local') {
            if (username) {
                this.state.username = username;
            }
            let profilePicture = Cookie.load('profilepicture');
            if (profilePicture) {
                this.state.profilePicture =
                require('../../../../webserver/images/' + profilePicture);
            }
            //    this.retriveChat();
        } else if (authType === 'facebook') {
            if (username) {
                this.state.username = username;
            }
            let profilePicture = Cookie.load('profilepicture');
            if (profilePicture) {
                this.state.profilePicture = profilePicture;
            }
        } else if (authType === 'google') {
            if (username) {
                this.state.username = username;
            }
            let profilePicture = Cookie.load('profilepicture');
            this.state.profilePicture = profilePicture;
        }
        this.retriveChat();
    }
    componentDidUpdate() {
        // Scroll as new elements come along
        let len = this.state.messages.length - 1;
        const node = ReactDOM.findDOMNode(this['_div' + len]);
        if (node) {
            node.scrollIntoView(false);
        }
    }
    retriveChat() {
        Axios.get('/retriveChat').then((response) => {
            if (response.data) {
                response.data.chats.forEach((chat) => {
                    let length = this.state.messages.length;
                    this.state.messages.push(
                        <div ref={(ref) => this['_div' + length] = ref}>
                            <AssistantUserView msgDate={chat.question.time}
                              userName={this.state.username} userMessage={chat.question.value}
                              profilePicture={this.state.profilePicture}/>
                        </div>
                    );
                    if (chat.isUnAnswered) {
                        chat.answerObj.forEach((answer, index) => {
                            let length = this.state.messages.length;
                            this.state.messages.push(
                                <div ref={(ref) => this['_div' + length] = ref}>
                                    <AssistantGinniPlainText value={answer.value}/>
                                </div>
                            );
                            if (answer.keywordResponse) {
                                let length = this.state.messages.length;
                                this.state.messages.push(
                                    <div ref={(ref) => this['_div' + length] = ref}>
                                        <AssistantGinniKeywordResponse
                                          handleGinniReply ={this.pushGinniMessages}
                                           question={chat.question.value} data={answer}/>
                                    </div>
                                );
                            }
                        });
                    } else {
                        let length = this.state.messages.length;
                        this.state.messages.push(
                            <div ref={(ref) => this['_div' + length] = ref}>
                                <AssistantGinniMixedReply question={chat.question.value}
                                   data={chat.answerObj} handleGinniReply={this.pushGinniMessages}/>
                            </div>
                        );
                    }
                });
            }
            this.setState({messages: this.state.messages, loaderActive: false});
        }).catch((err) => {
            this.setState({messages: this.state.messages, loaderActive: false});
        });
    }
    pushGinniMessages(ginniReply, loadingDots) {
        if (loadingDots) {
            this.state.messages.pop();
        }
        ginniReply.forEach((reply) => {
            let length = this.state.messages.length;
            let displayItem = (
                <div ref={(ref) => this['_div' + length] = ref} key={length}>
                    {reply}
                </div >
            );
            this.state.messages.push(displayItem);
        });
        this.setState({messages: this.state.messages});
    }
    pushUserMessages(message) {
        let length = this.state.messages.length;
        let userMessageDisplay = (
            <div ref={(ref) => this['_div' + length] = ref} key={length}>
                <AssistantUserView msgDate={message.time} userName={this.state.username}
                   userMessage={message.value} profilePicture={this.state.profilePicture}/>
            </div>
        );
        this.state.messages.push(userMessageDisplay);
        this.setState({messages: this.state.messages});
    }

    render() {
        return (
            <div className='formstyle' style={{
                backgroundImage: "url('../../images/background.jpg')"
            }}>
                <Dimmer active={this.state.loaderActive} inverted>
                    <Loader size='huge'>Loading previous chat history</Loader>
                </Dimmer>
                <Menu secondary>
                    <Menu.Item secondary position='right'/>
                    <Menu.Item position='left'>
                        <Input className='icon' style={{
                            width: 400
                        }} icon={< Icon name = 'search' color = 'red' circular link />}
                        placeholder='Search your content' focus/>
                    </Menu.Item>
                </Menu>
                <Scrollbars id='ginni' renderTrackHorizontal={props => <div {...props}
                  className="track-horizontal" style={{
                    display: 'none',
                    position: 'right',
                    minHeight: '516px'
                }}/>} autoHeight autoHeightMin={506}>
                    <div id='messagechat'>
                        {this.state.messages}
                    </div>
                </Scrollbars>
                <InputUserMessage username={this.state.username}
                  handlerUserReply={this.pushUserMessages}
                  handleGinniReply={this.pushGinniMessages}/>
            </div>
        );
    }
}
