import { Groups } from '../imports/api/groups';

Migrations.add({
  version: 1,
  up: function() {
    const groups = Groups.find({}).fetch();
    groups.forEach(g => {
      Groups.update({ _id: g._id }, {
        startDate: new Date(g.startDate),
        endDate: new Date(g.endDate)
      })
    })
  },
  down: function() {
    const groups = Groups.find({}).fetch();
    groups.forEach(g => {
      Groups.update({ _id: g._id }, {
        startDate: g.startDate.toString(),
        endDate: g.startDate.toString()
      })
    })
  }
});