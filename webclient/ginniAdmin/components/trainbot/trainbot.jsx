import React from 'react';
import {Grid, Card, Divider} from 'semantic-ui-react';
import IntentDropDown from './intentDropDown';
import InputNewSameAsIntent from './inputNewSameAsIntent';
import SameAsIntents from './sameAsIntents';
import NewIntentText from './newIntentText';
import './trainbot.css';
export default class TrainBot extends React.Component {
    constructor(props) {
        super(props);
        this.setSameAsIntents = this.setSameAsIntents.bind(this);
        this.addNewSameAsIntent = this.addNewSameAsIntent.bind(this);
        this.state = {
            sameAsIntentsDisplay: [],
            baseIntent: '',
            open: false
        };
    }
    setSameAsIntents(baseIntent, intents) {
        // map sameAs intents with baseIntent
        let sameAsIntentsDisplay = intents.map((intent, index) => {
            return <SameAsIntents key={index} intent={intent}/>;
        });
        this.setState({sameAsIntentsDisplay: sameAsIntentsDisplay, baseIntent: baseIntent});
    }
    addNewSameAsIntent(intent) {
      let length = this.state.sameAsIntentsDisplay.length;
      this.state.sameAsIntentsDisplay.push(<SameAsIntents key={length} intent={intent}/>);
      this.setState({sameAsIntentsDisplay: this.state.sameAsIntentsDisplay});
    }
    handleopen = () => {
      this.setState({open: true});
    }
    handleclose = () => {
      this.setState({open: false});
    }

    render() {
        return (
            <div style={{
                backgroundImage: "url('../../images/background.jpg')" ,
                height: '100%'
            }}>
                <Grid >
                  <Grid.Column width={1}/>
                  <Grid.Column width={6}>
                    <Grid.Row />
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={5}>
                            <h4>ADD TO EXISTING INTENT</h4>
                        </Grid.Column>
                        <Divider />
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={5} />
                        <Grid.Column width={6}>
                            <IntentDropDown handlerForSameAsIntents={this.setSameAsIntents}/>
                        </Grid.Column>
                    </Grid.Row>
                    <br/>
                    <Grid.Row>
                  <a><h5 onClick={this.handleopen} id='addintent'> Add More Intent ?</h5></a><br/>
                  { this.state.open ? <NewIntentText open={ this.handleclose}/> : null}
                </Grid.Row>
                    <br/><br/>
                    <Grid.Row>
                        <Grid.Column width={5} />
                        <Grid.Column width={6}>
                        <InputNewSameAsIntent baseIntent={this.state.baseIntent}
                          handlerAddNewIntent={this.addNewSameAsIntent}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row />
                    <br/><br/>
                    <Grid.Row>
                        <Grid.Column width={5} />
                        <Grid.Column width={6} />
                    </Grid.Row>
                    <Grid.Row />
                  </Grid.Column>
                  <Grid.Column width={0}/>
                  <Grid.Column width={7}>
                    <Grid.Row/>
                    <Card fluid color="blue">
                        <Card.Content>
                            <Card.Header>
                                <label><h4>List of Relevant Intent</h4></label>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            {this.state.sameAsIntentsDisplay}
                        </Card.Content>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={1}/>
                </Grid>
            </div>
        );
    }
}
