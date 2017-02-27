import React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import AssistantGinniUrlDisplay from './assistantGinniUrlDisplay';
import AssistantGinniVideoDisplay from './assistantGinniVideoDisplay';
import AssistantGinniMoreTextDisplay from './assistantGinniMoreTextDisplay';
import AssistantGinniPlainText from './assistantGinniPlainText';
import AssistantGinniOptions from './assistantGinniOptions';
//import CodeAssistantConfig from '../../../config/codeAssistant.json'

import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class AssistantGinniMixedReply extends React.Component {
    // props validation
    static propTypes = {
        handleGinniReply: React.PropTypes.func.isRequired,
        data: React.PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this.displayMoreText = this.displayMoreText.bind(this);
        this.displayVideos = this.displayVideos.bind(this);
        this.displayBlogs = this.displayBlogs.bind(this);
    }
    displayMoreText() {
        let textResponseArray = this.props.data.text;
        textResponseArray.shift();
        let ginniReply = textResponseArray.map((answer, index) => {
            return <AssistantGinniMoreTextDisplay
              question={this.props.question} textValue={answer.value}/>
        });
        this.props.handleGinniReply(ginniReply);
    }
    displayVideos() {
        let ginniReply = [<AssistantGinniPlainText value = 'Here is a top rated video for you' />];
        ginniReply.push(<AssistantGinniVideoDisplay
          question={this.props.question} handleGinniReply={this.props.handleGinniReply}
          videos={this.props.data.video}/>);
        this.props.handleGinniReply(ginniReply);
    }
    displayBlogs() {
        let ginniReply = [<AssistantGinniPlainText value = 'The most top rated blog for you is' />];
        ginniReply.push(<AssistantGinniUrlDisplay
          question={this.props.question} handleGinniReply={this.props.handleGinniReply}
          blogs={this.props.data.blog}/>);
        this.props.handleGinniReply(ginniReply);
    }
    render() {
        let text = '';
        if(this.props.data.text) {
          text = this.props.data.text[0].value;
        }
        return (
            <Feed id="ginniview">
                <Feed.Event>
                    <Feed.Label image='../../images/geniebot.jpg'/>
                    <Feed.Content>
                        <Feed.Summary date={this.props.data.time} user={CodeAssistant.Interaction.name}/>
                        <Feed.Extra text>
                            {text}
                        </Feed.Extra>
                        <Feed.Extra>
                            <Label.Group>
                                {this.props.data.text && this.props.data.text.length > 1
                                    ? <Label onClick={this.displayMoreText}
                                      basic color='orange' id='cursor'>View more</Label>
                                    : ''}
                                {this.props.data.blog
                                    ? <Label onClick={this.displayBlogs}
                                      basic color='orange' id='cursor'>Blogs</Label>
                                    : ''}
                                {this.props.data.video
                                    ? <Label onClick={this.displayVideos}
                                      basic color='orange' id='cursor'>Videos</Label>
                                    : ''}
                            </Label.Group>
                        </Feed.Extra>
                        <AssistantGinniOptions question={this.props.question}
                          type='text' value={text}/>
                    </Feed.Content>
                </Feed.Event>
              </Feed>
        );
    }
}
