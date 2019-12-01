import { Groups } from '../imports/api/groups';
import { Matches } from '../imports/api/matches';

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
      Meteor.users.update({ _id: u._id }, {
        $set: {
          discordUsername: u.username
        },
        $unset: {
          username: ""
        }
      })
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
