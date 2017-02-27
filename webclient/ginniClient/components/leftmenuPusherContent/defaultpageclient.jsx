import React from 'react';
import {Image, Grid} from 'semantic-ui-react';
import './defaultpageclient.css';
import DefaultHomePage from '../../../Multi_Lingual/Wordings.json';
export default class Defaultpage extends React.Component {

    constructor() {
        super();
    }
    render() {
        return (
            <Grid id="defaultgrid" style={{
                backgroundImage: "url('../../images/background.jpg')"
            }}>
                <Grid.Row columns={1}>
                    <div id="defaultdiv">
                        <Image src='../../images/reactlogo.png' centered size='small'/>
                        <h1 id='sparkle'>{DefaultHomePage.DefaultHome.Heading1}</h1>
                        <h2>{DefaultHomePage.DefaultHome.Heading2}</h2>
                          <h3>
                            <i>{DefaultHomePage.DefaultHome.Heading3}</i>
                        </h3>
                 <h5 id='defaulthead'>
                   {DefaultHomePage.DefaultHome.Heading4}
                        </h5>
                    </div>
                </Grid.Row>
            </Grid>
        );
    }
}
