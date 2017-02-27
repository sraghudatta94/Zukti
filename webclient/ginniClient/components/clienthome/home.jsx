import React from 'react';
import {Image, Icon, Divider, Grid, Popup} from 'semantic-ui-react';
import {hashHistory} from 'react-router';
import Axios from 'axios';
import Cookie from 'react-cookie';
import './homestyle.css';
import ClientHomePage from '../../../Multi_Lingual/Wordings.json';
export default class ClientHome extends React.Component {
/* if the user clicks logout it clears all the cookies
which is stored when user login and redirect to apphome*/
    handleLogout()
    {
      Axios({
              method: 'GET',
              url: '/signout',
              data: 'json'
            }).then(function (response) {
              Cookie.remove('authType');
              Cookie.remove('token');
              hashHistory.push('/');
            })
             .catch(function (error) {
                 console.log(error);
            });
    }
    // redirects to chat page
    onSubmitEmail() {
        hashHistory.push('/chat');
    }
    render() {
        return (
            <div style={{
                backgroundImage: "url('../../images/homepage.jpg')"
            }}>
                <Grid>
                    <Grid.Row/>
                    <Grid.Row>
                        <Grid.Column width={2}/>
                        <Grid.Column width={10}/>
                        <Grid.Column width={4}>
                            <Popup offset={-140} positioning='left center' trigger={<center>
                              <Icon name='sign out' size='large' inverted id='iconstyle'
                                 onClick={this.handleLogout.bind(this)}/>
                               </center>} content='Logout'/>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider horizontal inverted>
                        <h2 id='headsparkle'>{ClientHomePage.ClientHome.Heading1}
                          <br/>{ClientHomePage.ClientHome.Heading2}
                        </h2>
                    </Divider>
                    <Grid.Row divided vertically>
                        <Grid.Column width={2}/>
                        <Grid.Column width={4} centered={true}>
                            <Grid.Row>
                                <center>
                                    <Image className="imagepointer" src='../../images/react.jpg'
                                    size='small' avatar onClick={this.onSubmitEmail.bind(this)}/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                    <h2 className="heading1"
                                      onClick={this.onSubmitEmail.bind(this)}>{ClientHomePage.ClientHome.Topic1}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                  <Image src='../../images/express.png' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                        <h2 className="heading2">{ClientHomePage.ClientHome.Topic2}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                    <Image src='../../images/java.png' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                        <h2 className="heading3">{ClientHomePage.ClientHome.Topic3}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={2}/>
                    </Grid.Row>
                    <Grid.Row divided vertically>
                        <Grid.Column width={2}/>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                  <Image src='../../images/js.jpg' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                        <h2 className="heading4">{ClientHomePage.ClientHome.Topic4}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center>
                                    <Image src='../../images/node.jpg' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                        <h2 className="heading5">{ClientHomePage.ClientHome.Topic5}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid.Row>
                                <center><Image src='../../images/plus2.jpg' size='small' avatar/>
                                </center>
                            </Grid.Row>
                            <Grid.Row>
                                <center>
                                        <h2 className="heading6">{ClientHomePage.ClientHome.Topic6}</h2>
                                </center>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={2}/>
                    </Grid.Row>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/>
                    <Grid.Row/><br/><br/>
                </Grid>
            </div>
        );
    }
}
