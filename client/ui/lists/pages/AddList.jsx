import React from 'react';
import { BaseAddGroup } from '../../components/groups/BaseAddGroup';
import { createListSchema } from '../../../../imports/api/lists';

export const AddList = () => {
    return(
        <BaseAddGroup
            title={"Create List"}
            createUrl={id => `/lists/${id.toHexString()}`}
            method={"lists.create"}
            schema={createListSchema}
        />
    )
}