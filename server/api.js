import { Groups } from '/imports/api/groups';

WebApp.connectHandlers.use("/api/groups", (req, res, next) => {
    const groups = Groups.find({}).fetch();
    res.end(JSON.stringify(groups));
});
