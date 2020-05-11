import React from 'react';
import {BaseGroupList} from "../components/groups/BaseGroupList";
import {BellGroups} from "../../../imports/api/bell_groups";
import {EnterBells} from "../components/bells/EnterBells";

export const BellGroupList = () => {
  return(
    <>
      <EnterBells />
      <BaseGroupList
        subscription={"bell_groups"}
        collection={BellGroups}
        addLinkLabel={"Create Turnip Group"}
        addUrl={"/bells/groups/add"}
        createGroupUrl={id => `/bells/groups/${id.toHexString()}`}
        deleteMethod={"bell_groups.delete"}
        title={"Bell Groups"}
      />
    </>
  )
}
