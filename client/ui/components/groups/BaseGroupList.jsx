import React from 'react';
import {LinearProgress} from "@material-ui/core";
import { useTracker } from 'meteor/react-meteor-data';
import { useUser } from 'meteor/cereal:ui/hooks/useUser.ts';
import PaddedPaper from "../PaddedPaper";
import Header from "../Header";
import Typography from "@material-ui/core/Typography";
import StyledTable from "../StyledTable";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import MuiLink from "@material-ui/core/Link";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from 'prop-types';

export const BaseGroupList = ({subscription, collection, addLinkLabel, addUrl, title, createGroupUrl, deleteMethod}) => {
  const ready = useTracker(() => Meteor.subscribe(subscription).ready(), [subscription]);
  const user = useUser();

  if(!ready) {
    return <LinearProgress />
  }
  const groups = collection.find({
    userIds: {
      $elemMatch: {
        $eq: user._id
      }
    }
  }).fetch();
  return(
    <PaddedPaper>
      <Header title={title} to={addUrl} linkLabel={addLinkLabel} />
      {
        groups.length === 0
          ? <Typography>You don't have any groups!</Typography>
          : <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell># Participants</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {
                groups.map(g => {
                  return(
                    <TableRow key={g._id}>
                      <TableCell>
                        <MuiLink component={Link} to={createGroupUrl(g._id)}>
                          {g.name}
                        </MuiLink>
                      </TableCell>
                      <TableCell>
                        {g.userIds.length}
                      </TableCell>
                      <TableCell>
                        {
                          g.creator === user._id &&
                          <IconButton edge="end" aria-label="delete" onClick={() => {
                            if(window.confirm("Are you sure you want to delete this?")) {
                              Meteor.call(deleteMethod, g._id)
                            }
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </StyledTable>
      }
    </PaddedPaper>
  )
}

BaseGroupList.propTypes = {
  subscription: PropTypes.string,
  collection: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string
  }),
  createGroupUrl: PropTypes.func,
  deleteMethod: PropTypes.string,
  addLinkLabel: PropTypes.string,
  addUrl: PropTypes.string,
  title: PropTypes.string
}
