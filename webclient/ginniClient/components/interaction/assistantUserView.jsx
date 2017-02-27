import React from 'react';
import {Feed, Image} from 'semantic-ui-react';
import './chatcontainerstyle.css';

export default class AssistantView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Feed id='assistantView'>
                <Feed.Event>
                    <Image avatar src={this.props.profilePicture} />
                    <Feed.Content>
                        <Feed.Summary date={this.props.msgDate}
                          user={this.props.userName} style={{marginLeft: '15px'}}/>
                        <Feed.Extra text style={{marginLeft: '15px'}}>
                            {this.props.userMessage}
                        </Feed.Extra>
                        <Feed.Meta/>
                    </Feed.Content>
                </Feed.Event>
            </Feed>

        );
    }
}
