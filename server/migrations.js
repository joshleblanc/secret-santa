import { Groups } from '../imports/api/groups';
import { Matches } from '../imports/api/matches';
import {sync} from "../imports/api/users";
Migrations.add({
  version: 1,
  up: function() {
    const groups = Groups.find({}).fetch();
    groups.forEach(g => {
      Groups.update({ _id: g._id }, {
        $set: {
          startDate: new Date(g.startDate),
          endDate: new Date(g.endDate)
        }
      })
    })
  },
  down: function() {
    const groups = Groups.find({}).fetch();
    groups.forEach(g => {
      Groups.update({ _id: g._id }, {
        $set: {
          startDate: g.startDate.toString(),
          endDate: g.startDate.toString()
        }
      })
    })
  }
});

Migrations.add({
  version: 2,
  up: function() {
    const groups = Groups.find({}).fetch();
    groups.forEach(g => {
      Groups.update({ _id: g._id }, {
        $set: {
          hasMatches: false
        }
      })
    })
  },
  down: function() {
    const groups = Groups.find({}).fetch();
    groups.forEach(g => {
      Groups.update({ _id: g._id }, {
        $unset: {
          hasMatches: ""
        }
      })
    })
  }
});

Migrations.add({
  version: 3,
  up: function() {
    const users = Meteor.users.find({}).fetch();
    users.forEach(u => {
      Meteor.users.update({ _id: u._id }, {
        $set: {
          avatar: u.services.discord.avatar,
          discordId: u.services.discord.id,
          email: u.services.discord.email,
          username: u.services.discord.username
        }
      })
    })
  },
  down: function() {
    const users = Meteor.users.find({}).fetch();
    users.forEach(u => {
      Meteor.users.update({ _id: u._id }, {
        $unset: {
          avatar: "",
          discordId: "",
          email: "",
          username: ""
        }
      })
    })
  }
});

Migrations.add({
  version: 4,
  up: function() {
    const users = Meteor.users.find({}).fetch();
    users.forEach(u => {
      try {
        Meteor.users.update({ _id: u._id }, {
          $set: {
            discordUsername: u.username
          },
          $unset: {
            username: ""
          }
        })
      } catch(e) {
        console.log(e.message);
      }
    });
  },
  down: function() {
    const users = Meteor.users.find({}).fetch();
    users.forEach(u => {
      Meteor.users.update({ _id: u._id }, {
        $set: {
          username: u.discordUsername
        },
        $unset: {
          discordUsername: ""
        }
      })
    });
  }
});

Migrations.add({
  version: 5,
  up: function() {
    Matches.update({}, {
      $set: {
        shipped: false
      }
    }, {
      multi: true
    })
  },
  down: function() {
    Matches.update({}, {
      $unset: {
        shipped: ""
      }
    }, {
      multi: true
    });
  }
});

Migrations.add({
  version: 6,
  up: function() {
    Meteor.users.find({}).fetch().forEach(u => sync(u));
  },
  down: function() {
    Meteor.users.update({}, {
      $unset: {
        avatarUrl: ""
      }
    }, {
      multi: true
    });
  }
});

Migrations.add({
  version: 7,
  up: function() {
    Meteor.users.find({}).fetch().forEach(user => {
      const weights = user.weights;
      if(weights) {
        weights.forEach(w => w.weight = parseFloat(w.weight));
        Meteor.users.update({ _id: user._id }, {
          $set: {
            weights
          }
        })
      }
    })
  },
  down: function() {
    Meteor.users.find({}).fetch().forEach(user => {
      const weights = user.weights;
      if(weights) {
        weights.forEach(w => `${w.weight}`);
        Meteor.users.update({ _id: user._id }, {
          $set: {
            weights
          }
        })
      }

    })
  }
})
