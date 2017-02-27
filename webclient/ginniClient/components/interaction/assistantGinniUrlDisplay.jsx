import React from 'react';
import {Feed, Label} from 'semantic-ui-react';
import AssistantGinniMoreBlogsView from './assistantGinniMoreBlogsView';
import AssistantGinniOptions from './assistantGinniOptions';
import UnfurlLink from './unfurlLink';
import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class AssistantGinniMixedReply extends React.Component {
  constructor(props) {
      super(props);
      this.displayMoreBlogs = this.displayMoreBlogs.bind(this);
  }
  displayMoreBlogs() {
    let ginniReply = [];
    let blogsResponseArray = this.props.blogs;
    blogsResponseArray.shift();
    blogsResponseArray.forEach((blog)=>{
      ginniReply.push(<AssistantGinniMoreBlogsView
        question={this.props.question} value={blog.value}/>);
    });
    this.props.handleGinniReply(ginniReply);
  }
    render() {
      let blogUrl = this.props.blogs[0].value;
        return (
            <Feed id="ginniview">
                <Feed.Event>
                    <Feed.Label image='../../images/geniebot.jpg'/>
                    <Feed.Content>
                        <Feed.Summary date={new Date().toLocaleString()} user={CodeAssistant.Interaction.name}/>
                        <Feed.Extra images>
                            <UnfurlLink url ={blogUrl}/>
                        </Feed.Extra>
                        <Feed.Extra>
                          <Label.Group >
                              {this.props.blogs.length > 1
                                  ? <Label onClick={this.displayMoreBlogs} basic color='orange' id='cursor'>
                                    View more blogs ({this.props.blogs.length - 1})</Label>
                                  : ''}
                          </Label.Group>
                        </Feed.Extra>
                        <AssistantGinniOptions question={this.props.question}
                          type='blog' value={blogUrl}/>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}
