import * as yup from 'yup';
import {createGroup} from "../lib/groups";

const { collection, createSchema } = createGroup("weight_groups")
export const WeightGroups = collection;
export const createWeightGroupsSchema = createSchema;
