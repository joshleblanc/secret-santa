import { Groups, insertSchema } from '/imports/api/groups';
import { JsonRoutes } from 'meteor/simple:json-routes';

JsonRoutes.add("get", "/api/groups", function (req, res, next) {
    const groups = Groups.find({}).fetch();
    JsonRoutes.sendResult(res, {
        data: groups
    });
});

/**
 * Needs a post body of
 * {
 *     name: "",
 *     startDate: "",
 *     endDate: ""
 * }
 */
JsonRoutes.add("post", "/api/groups/add", function(req, res, next) {
    try {
        insertSchema.validateSync(req.body);
        Groups.insert(req.body, (err, res) => {
            if(err) {
                JsonRoutes.sendResult({
                    data: {
                        error: err.message
                    }
                });
            } else {
                const group = Groups.findOne({ _id: res });
                JsonRoutes.sendResult({
                    data: group
                });
            }
        });
    } catch(e) {
        JsonRoutes.sendResult({
            data: {
                error: e.message
            }
        })
    }
});

/**
 * Join a secret santa
 */
JsonRoutes.add("post", "/api/groups/join", function(req, res, next) {

});

/**
 * Leave a secret santa
 */
JsonRoutes.add("post", "/api/groups/leave", function(req, res, next) {

});

/**
 * List participants
 */
JsonRoutes.add("get", "/api/groups/:id", function(req, res, next) {

});
