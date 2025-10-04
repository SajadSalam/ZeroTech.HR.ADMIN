import {
  required,
  email,
  helpers,
  numeric,
  minLength,
  maxLength,
  sameAs,
  minValue,
  maxValue,
  decimal,
  integer,
} from '@vuelidate/validators'
import type { Composer } from 'vue-i18n'

export type ValidationRule =
  | 'required'
  | 'email'
  | 'minLength'
  | 'maxLength'
  | 'sameAs'
  | 'numeric'
  | 'minValue'
  | 'maxValue'
  | 'integer'
  | 'decimal'
  | 'alpha'
  | 'alphaNum'
  | 'mobile'
  | 'lat'
  | 'lng'

export const createValidator = (
  t: Composer['t'],
  fieldName: string,
  rule: ValidationRule,
  params?: any
) => {
  const i18nFieldName = t(fieldName) || fieldName
  const messages = {
    required: () => t('validation.required', { field: i18nFieldName }),
    email: () => t('validation.email', { field: fieldName }),
    minLength: () => t('validation.minLength', { field: fieldName, min: params }),
    maxLength: () => t('validation.maxLength', { field: fieldName, max: params }),
    sameAs: () => t('validation.sameAs', { field: fieldName, fieldToMatch: params }),
    numeric: () => t('validation.numeric', { field: fieldName }),
    minValue: () => t('validation.minValue', { field: fieldName, min: params }),
    maxValue: () => t('validation.maxValue', { field: fieldName, max: params }),
    integer: () => t('validation.integer', { field: fieldName }),
    decimal: () => t('validation.decimal', { field: fieldName }),
    alpha: () => t('validation.alpha', { field: fieldName }),
    alphaNum: () => t('validation.alphaNum', { field: fieldName }),
    mobile: () => t('validation.mobile', { field: fieldName }),
    lat: () => t('validation.lat', { field: fieldName }),
    lng: () => t('validation.lng', { field: fieldName }),
  }

  const validators = {
    required,
    email,
    minLength: minLength(params),
    maxLength: maxLength(params),
    sameAs: sameAs(params),
    numeric,
    minValue: minValue(params),
    maxValue: maxValue(params),
    integer,
    decimal,
    alpha: (value: string) => /^[A-Za-z\u0600-\u06FF\s]+$/.test(value),
    alphaNum: (value: string) => /^[A-Za-z0-9\u0600-\u06FF\s]+$/.test(value),
    mobile: (value: string) => /^[0-9]{10,}$/.test(value),
    lat: (value: string) => {
      const latValue = parseFloat(value)
      return !isNaN(latValue) && latValue >= -90 && latValue <= 90
    },
    lng: (value: string) => {
      const lngValue = parseFloat(value)
      return !isNaN(lngValue) && lngValue >= -180 && lngValue <= 180
    },
  }

  return helpers.withMessage(messages[rule], validators[rule])
}
