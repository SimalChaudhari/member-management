/**
 * Work Experience form validation schema (Yup).
 * Reusable for any form that collects employment history.
 */

import * as Yup from 'yup';
import { JOB_RESPONSIBILITIES_MAX } from './workExperienceConstants';

export const workExperienceFormSchema = Yup.object().shape({
  Other_Organisation_Name__c: Yup.string()
    .trim()
    .required('Organisation name is required'),
  Is_Current_Employment__c: Yup.boolean(),
  Organisation_Type__c: Yup.string()
    .trim()
    .required('Organisation type is required'),
  Industry__c: Yup.string()
    .trim()
    .required('Industry is required'),
  Job_Position__c: Yup.string()
    .trim()
    .required('Job position is required'),
  Job_Level__c: Yup.string()
    .trim()
    .required('Job level is required'),
  Job_Function__c: Yup.string()
    .trim()
    .required('Job function is required'),
  Employment_Start_Date__c: Yup.string()
    .trim()
    .required('Period from is required'),
  Employment_End_Date__c: Yup.string().trim(),
  Employment_Status__c: Yup.string()
    .trim()
    .required('Employment status is required'),
  Job_Responsibilities__c: Yup.string()
    .trim()
    .required('Description of job responsibilities is required')
    .max(JOB_RESPONSIBILITIES_MAX, `Maximum ${JOB_RESPONSIBILITIES_MAX} characters allowed`),
  Experience__c: Yup.string().trim(),
  Employer_Name__c: Yup.string().trim(),
});

export type WorkExperienceFormValues = Yup.InferType<typeof workExperienceFormSchema>;
