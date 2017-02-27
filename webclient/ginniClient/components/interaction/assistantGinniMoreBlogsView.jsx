import React from 'react';
import {Feed} from 'semantic-ui-react';
import UnfurlLink from './unfurlLink';
import AssistantGinniOptions from './assistantGinniOptions';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class AssistantGinniMoreBlogsView extends React.Component {
    // props validation
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Feed id="ginniview">
                <Feed.Event>
                    <Feed.Label image='../../images/geniebot.jpg'/>
                    <Feed.Content>
                        <Feed.Summary date={new Date().toLocaleString()} user={CodeAssistant.Interaction.name}/>
                        <Feed.Extra images>
                            <UnfurlLink url={this.props.value} />
                        </Feed.Extra>
                            <AssistantGinniOptions question={this.props.question}
                              type='blog' value={this.props.value}/>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}
