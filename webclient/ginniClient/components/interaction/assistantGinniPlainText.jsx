import React from 'react';
import {Feed} from 'semantic-ui-react';
import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';
export default class AssistantView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Feed id='assistantView'>
                <Feed.Event>
                    <Feed.Label image='../../images/geniebot.jpg'/>
                    <Feed.Content>
                        <Feed.Summary date={new Date().toLocaleString()} user={CodeAssistant.Interaction.name}/>
                        <Feed.Extra text>
                            {this.props.value}
                        </Feed.Extra>
                        <Feed.Meta/>
                    </Feed.Content>
                </Feed.Event>
            </Feed>

        );
    }
}
