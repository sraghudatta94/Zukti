import React from 'react';
import DefaultPage from './defaultpageclient';
import AssistanView from '../interaction/assistantChatContainer';
import Notifications from '../notification/notifications';
import BookmarkList from '../bookmarks/bookmarkList';
export default class LeftMenuContent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        switch (this.props.sidebarItemSelected) {
            case 'Build':
                {
                    return <DefaultPage/>;
                }
            case 'Home':
                {
                    return <DefaultPage/>;
                }
            case 'ChatBot':
                {
                    return <AssistanView/>;
                }

            case 'Bookmarks':
                {
                    return <BookmarkList/>;
                }
            case 'notifications':
                {
                    return <Notifications/>;
                }
        }
    }
}
