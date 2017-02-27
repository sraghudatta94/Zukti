import React from 'react';
import {Feed} from 'semantic-ui-react';
import {ThreeBounce} from 'better-react-spinkit';
import './chatcontainerstyle.css';
import CodeAssistant from '../../../Multi_Lingual/Wordings.json';

export default class LoadingDots extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Feed id='assistantView'>
                <Feed.Event>
                    <Feed.Label image='../../images/geniebot.jpg'/>
                    <Feed.Content>
                        <Feed.Summary user={CodeAssistant.Interaction.name}/>
                        <Feed.Extra text>
                            <ThreeBounce timingFunction='linear'
                               duration='1.5s' gutter={8} size={15} color='brown' />
                        </Feed.Extra>
                    </Feed.Content>
                </Feed.Event>
            </Feed>

        );
    }
}
