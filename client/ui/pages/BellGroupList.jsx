import React from 'react';
import {BaseGroupList} from "../components/groups/BaseGroupList";
import {BellGroups} from "../../../imports/api/bell_groups";

export const BellGroupList = () => {
  return(
    <BaseGroupList
      subscription={"bell_groups"}
      collection={BellGroups}
      addLinkLabel={"Create Bell Group"}
      addUrl={"/bells/groups/add"}
      createGroupUrl={id => `/bells/groups/${id.toHexString()}`}
      deleteMethod={"bell_groups.delete"}
      title={"Bell Groups"}
    />
  )
}
