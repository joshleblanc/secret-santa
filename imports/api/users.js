import * as yup from 'yup';

export const schema = yup.object().shape({
    apiKey: yup.string().matches(/[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{20}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}/, "Not a valid api key")
});
