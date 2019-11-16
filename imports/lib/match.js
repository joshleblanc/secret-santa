/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * https://stackoverflow.com/a/12646864/2424975
 */
import {Groups} from "../api/groups";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function partition(arr) {
  const ret = [];
  let copy = arr.slice();

  for(let i = 0; i < arr.length; i++) {
    const slice = arr.slice(i, i + 2);
    ret.push(slice);
    copy = copy.filter(el => el !== slice[1]);
  }
  ret[ret.length - 1].push(copy[0]);
  return ret;
}

export function match(arr) {
  shuffleArray(arr);
  return partition(arr);
}

export function sendEmails(group) {
  const participants = group.participants;
  const users = Meteor.users.find({
    discordId: {
      $in: participants
    }
  }).fetch();
  console.log("Sending email to ", participants);
  Email.send({
    from: "secret-santa@grep.sh",
    bcc: users.map(u => u.email),
    subject: "Your secret santa match has been made!",
    text: "You're a secret santa!\n" +
      `Head over to ${Meteor.absoluteUrl(`/groups/${group._id.toHexString()}`)} to check it out!`
  });
}
