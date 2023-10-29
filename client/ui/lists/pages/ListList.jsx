import React from 'react';
import {Lists} from "../../../../imports/api/lists";
import {BaseGroupList} from "../../components/groups/BaseGroupList";

export const ListList = () => {
    return(
        <BaseGroupList
          subscription={"lists"}
          collection={Lists}
          createGroupUrl={id => `/lists/${id.toHexString()}`}
          deleteMethod={"lists.delete"}
          title={"Lists"}
          addUrl={"/lists/add"}
          addLinkLabel={"Create List"}
        />
      )
}