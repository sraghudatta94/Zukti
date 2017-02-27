import React from 'react';
import {Feed} from 'semantic-ui-react';
import ReactPlayer from 'react-player';
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
                        <Feed.Extra >
                            <ReactPlayer url={this.props.url} playing={false} controls={true}/>
                        </Feed.Extra>
                    </Feed.Content>
                </Feed.Event>
            </Feed>

        );
    }
}
