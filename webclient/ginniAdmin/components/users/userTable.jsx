import React from 'react';
import {Grid, Image, Divider} from 'semantic-ui-react';
import Axios from 'axios';
import ViewUserChat from './viewUserChat';
import './userTable.css';
import {Scrollbars} from 'react-custom-scrollbars';
export default class UserTable extends React.Component
{
  constructor() {
      super();
      this.state = {
        name: [],
        email: [],
        userinformation: []
      };
    }
    componentDidMount() {
      var self=this;
      Axios({
      url: 'http://localhost:8080/viewall',
      method: 'GET'
    }).then(function(response) {
    self.setState({ userinformation: response.data});
}).
    catch(function(err) {
        console.log(err);
        });
    }
    history(email) {
     console.log(email);
    }

render() {
    let user = this.state.userinformation.map(function(newsdata) {
return (
  <div id='eachcardstyle'>
    <Grid>
      <Grid.Row>
      <Grid.Column width={3}>
        <center>
          <Image avatar src={require('../../../../webserver/images/' + newsdata.local.photos)}/>
      </center>
    </Grid.Column>
          <Grid.Column width={4}>
          <h4><b>{newsdata.local.name}</b></h4>
        </Grid.Column>
        <Grid.Column width={5}>
          <b style={{color: 'blue'}}>{newsdata.local.email}</b>
        </Grid.Column>
<Grid.Column width={3}>
          <div>
            <ViewUserChat userEmail={newsdata.local.email}/>
          </div>
        </Grid.Column>
        <Grid.Column width={1} />
</Grid.Row>
</Grid>
    </div>
  );
}.bind(this));
return(
  <div style={{
      backgroundImage: 'url("../../images/background.jpg")', marginTop: '1%',
      height: '100%'
    }}>
  <Grid divided='vertically'>
      <Grid.Row columns={3}>
        <Grid.Column width={1}/>
      <Grid.Column width={14} >
          <Scrollbars renderTrackHorizontal={props => <div {...props}
            className="track-horizontal" style={{
              display: 'none',
              position: 'right'
          }}/>} autoHeight autoHeightMin={554}>
              <div style={{width: '98%', height: '50%'}} >
                <h3 style={{color: 'red', fontStyle: 'bold'}}>USER DETAILS</h3>
                <Divider/>
                           {user}
             </div></Scrollbars>
                  </Grid.Column>
              </Grid.Row>
            </Grid>
  </div>

);
}
}
