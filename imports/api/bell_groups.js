import {createGroup} from "../lib/groups";

const { collection, createSchema } = createGroup("bell_groups");

export const BellGroups = collection;
export const createBellGroupSchema = createSchema;
