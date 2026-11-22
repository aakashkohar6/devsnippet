import type { ActionHandler } from 'deepspace/worker'
import type { Env } from '../../worker'

export const actions: Record<string, ActionHandler<Env>> = {
  createSnippet: async ({ userId, params, tools }) => {
    const title = params.title
    const language = params.language
    const code = params.code

    if (
      typeof title !== 'string' ||
      typeof language !== 'string' ||
      typeof code !== 'string'
    ) {
      return { success: false, error: 'Invalid snippet data' }
    }

    if (!title.trim() || !code.trim()) {
      return { success: false, error: 'Title and code are required' }
    }

    return await tools.create('snippets', {
      title: title.trim(),
      language,
      code,
      ownerId: userId,
    })
  },
}