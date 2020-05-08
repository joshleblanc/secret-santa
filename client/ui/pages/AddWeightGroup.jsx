import React from 'react';
import {BaseAddGroup} from "../components/groups/BaseAddGroup";
import {createWeightGroupsSchema} from "../../../imports/api/weight_groups";

export const AddWeightGroup = () => {
    return(
      <BaseAddGroup
        title={"Create Weight Loss Group"}
        createUrl={(id) => `/weight_groups/${id.toHexString()}`}
        method={"weight_groups.create"}
        schema={createWeightGroupsSchema}
      />
    )
}
