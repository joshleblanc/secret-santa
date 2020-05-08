import React from 'react';
import {WeightGroups} from "../../../imports/api/weight_groups";
import {BaseGroupList} from "../components/groups/BaseGroupList";

export const WeightGroupList = () => {
    return(
      <BaseGroupList
        subscription={"weight_groups"}
        collection={WeightGroups}
        createGroupUrl={id => `/weight_groups/${id.toHexString()}`}
        deleteMethod={"weight_groups.delete"}
        title={"Weight Loss Groups"}
        addUrl={"/weight_groups/add"}
        addLinkLabel={"Create Weight Group"}
      />
    )
}
