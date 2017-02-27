import React from 'react';
import {Feed} from 'semantic-ui-react';
import AssistantGinniOptions from './assistantGinniOptions';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class AssistantGinniMoreTextView extends React.Component {
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
                        <Feed.Extra text>
                            {this.props.textValue}
                        </Feed.Extra>
                        <Feed.Extra/>
                      <AssistantGinniOptions question={this.props.question}
                        type='text' value={this.props.textValue}/>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}
