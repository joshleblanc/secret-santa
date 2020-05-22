import React from 'react';
import {BaseAddGroup} from "../../components/groups/BaseAddGroup";
import {createBellGroupSchema} from "../../../../imports/api/bell_groups";

export const AddBellGroup = () => {
  return(
    <BaseAddGroup
      title={"Create Bell Group"}
      createUrl={(id) => `/bells/groups/${id.toHexString()}`}
      method={"bell_groups.create"}
      schema={createBellGroupSchema}
    />
  );
}
