import API from '../../../shared/api/api'

import { buildTemplatePayload }
  from './buildTemplatePayload'

/**
 * Saves a new template.
 * Builds template payload
 * and stores it in backend.
 * @param {{ template: object }} params
 * Template save data
 * @returns {Promise<object>}
 * Saved template
 */
export async function saveTemplate({
  template,
}) {
  const payload =
    buildTemplatePayload(template)

  const res = await API.post(
    '/templates',
    payload,
  )

  return res.data
}

/**
 * Updates an existing template.
 * Builds template payload
 * and updates template in backend.
 * @param {{
 *  id: string,
 *  template: object
 * }} params
 * Template update data
 * @returns {Promise<object>}
 * Updated template
 */
export async function updateSavedTemplate({
  id,
  template,
}) {
  const payload =
    buildTemplatePayload(template)

  const res = await API.put(
    `/templates/${id}`,
    payload,
  )

  return res.data
}
