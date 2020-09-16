import React from 'react';
import { autorun } from 'meteor/cereal:reactive-render';
import LinearProgress from "@material-ui/core/LinearProgress";
import { Matches } from '/imports/api/matches';
import PaddedPaper from "../components/PaddedPaper";
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from "@material-ui/core/TextField";
import { Groups } from '/imports/api/groups';

const styles = theme => ({
  messages: {
    borderColor: theme.contrastText,
    borderWidth: 1,
    borderStyle: 'solid',
    height: 250,
    overflowY: 'auto'
  }
});

@withStyles(styles)
@autorun
export default class extends React.Component {
  state = {
    inputMessage: ""
  };

  handleInputChange = e => {
    this.setState({
      inputMessage: e.target.value
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { inputMessage } = this.state;
    Meteor.call('match.sendMessage', id, inputMessage);
    this.setState({
      inputMessage: ""
    });
  };

  messagesRef = r => {
    this.messagesElement = r;
  };

  scrollToBottom() {
    if(this.messagesElement) {
      this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scrollToBottom();
    const { id } = this.props.match.params;
    Meteor.call('match.readMessage', id)
  }

  render() {
    const { classes } = this.props;
    const { inputMessage } = this.state;
    const matchSubscription = Meteor.subscribe('messages', this.props.match.params.id, Meteor.userId());
    if(!matchSubscription.ready()) {
      return <LinearProgress />
    }
    const match = Matches.findOne({
      _id: new Mongo.ObjectID(this.props.match.params.id)
    });
    if(!match) {
      return null;
    }
    const group = Groups.findOne({
      _id: match.groupId
    });
    const receiver = Meteor.users.findOne({ discordId: match.receiver });
    const user = Meteor.user();
    const areSecretSanta = !!match.gifter;
    let title;
    if(areSecretSanta) {
      title = `You are talking to ${receiver.discordUsername}. They will see you as Secret Santa`;
    } else {
      title = `You are talking to your Secret Santa`;
    }
    return(
      <PaddedPaper>
        <Typography variant={"h4"}>
          {group.name}
        </Typography>
        <Typography variant={"subtitle2"}>
          {title}
        </Typography>
        <PaddedPaper elevation={0} className={classes.messages} ref={this.messagesRef}>
          {
            match.messages && match.messages.map((m, i) => {
              let name;
              if(m.sender === user._id) {
                name = "You";
              } else if(m.sender === receiver._id) {
                name = receiver.discordUsername;
              } else {
                name = "Secret Santa";
              }
              return(
                <p key={i}>
                  <Typography component={"span"}>{name}: </Typography>
                  <Typography component="span" variant={"body2"}>{m.message}</Typography>
                </p>
              )
            })
          }
        </PaddedPaper>
        <form onSubmit={this.handleSubmit}>
          <TextField label={"Send a message"} fullWidth value={inputMessage} onChange={this.handleInputChange}/>
        </form>
      </PaddedPaper>
    )
  }
}