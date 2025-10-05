# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
``

---
alwaysApply: true
---
})

const entityStore = useEntityStore()
const appTableStore = useAppTableStore()
const isLoading = computed(() => entityStore.isLoading)
const entities = computed(() => entityStore.entities || [])
const filters = computed<EntityFilters>({
  get() {
    return entityStore.filters
  },
  set(value) {
    entityStore.filters = value
  },
})

const getEntities = async () => {
  appTableStore.setLoading(true)
  await entityStore.getEntities()
  appTableStore.setLoading(false)
}

getEntities()
watch(filters, () => { getEntities() }, { deep: true })

</script>

<template>
  <div>
    <AppCrud
      add-button-text="Arabic Add Button Text"
      :add-btn-action="() => (entityStore.isCreateDialogOpen = true)"
      :pagination="true"
      :total-pages="entityStore.totalPages"
      title="Arabic Title"
      @update:current-page="filters.pageNumber = $event"
    >
      <template #filters>
        <BaseInput v-model="filters.name" placeholder="Arabic Search" />
        <!-- Additional filters -->
      </template>
      <AppTable
        title="Arabic Table Title"
        :headers="tableHeader()"
        :items="entities"
        :is-loading="isLoading"
      >
        <template #data-actions="{ item }">
          <AppCrudActions
            :item="item"
            :edit-button-action="() => {
              entityStore.selectedEntity = item
              entityStore.selectedEntityId = item.id
              entityStore.isEditDialogOpen = true
            }"
            :delete-service="entityStore.deleteEntity"
          />
        </template>
      </AppTable>
    </AppCrud>
    <EntityCreate />
    <EntityEdit />
  </div>
</template>
```

### 6. Create/Edit Component Pattern
```vue
<script setup lang="ts">
import AppInputField from '~/components/app-field/AppInputField.vue'
import AppTextAreaField from '~/components/app-field/AppTextAreaField.vue'
import AppAutoCompleteField from '~/components/app-field/AppAutoCompleteField.vue'
import { requiredValidator } from '~/services/validation'
import { Validator } from '~/services/validator'
import { useEntityStore } from '../store'
import type { EntityCreateDto } from '../types'

const entityStore = useEntityStore()

const validator = new Validator<EntityCreateDto>(
  {
    // Default values
  },
  {
    // Validation rules with Arabic messages
    name: {
      required: requiredValidator('Arabic Field Name'),
    },
  }
)

const body = validator.validation
const isLoading = computed(() => entityStore.isLoading)

const createEntity = async () => {
  const isValid = await body.value.$validate()
  if (!isValid) return
  await entityStore.createEntity(validator.extractBody())
  validator.resetBody()
  entityStore.isCreateDialogOpen = false
}

watch(() => entityStore.isCreateDialogOpen, (val: boolean) => {
  if (val) validator.resetBody()
})
</script>

<template>
  <AppDialog
    v-model="entityStore.isCreateDialogOpen"
    title="Arabic Dialog Title"
    size="xl"
    overflow-y="visible"
  >
    <!-- Form fields with Arabic labels -->
    <template #actions>
      <BaseButton color="primary" class="gap-1" :loading="isLoading" @click="createEntity">
        <Icon name="ph:upload-simple-duotone" class="size-5" />
        Arabic Action Text
      </BaseButton>
    </template>
  </AppDialog>
</template>
```

## Language and Localization Rules

### 1. Arabic-First Approach
- **NEVER** use `$t()` or i18n functions
- All text should be directly in Arabic
- Use Arabic placeholders, labels, and messages
- Arabic text should be semantically correct and professional

### 2. Text Examples
```typescript
// Good
title="إنشاء قسم جديد"
placeholder="البحث في الأقسام"
label="اسم القسم"

// Bad
:title="$t('create-department')"
:placeholder="$t('search-departments')"
:label="$t('department-name')"
```

## Component Usage Rules

### 1. Form Fields
- Always use components from `~/components/app-field/`
- Use `AppInputField`, `AppTextAreaField`, `AppAutoCompleteField`
- Always include Arabic labels and proper validation

### 2. Tables and CRUD
- Always use `AppCrud` wrapper component
- Use `AppTable` for data display
- Use `AppCrudActions` for action buttons
- Template slots should use `#data-*` prefix

### 3. Validation
- Use `Validator` class from `~/services/validator`
- Use `requiredValidator` with Arabic messages
- Always validate before API calls

## API Integration Rules

### 1. Axios Usage
- Import from `~/services/app-client/axios`
- Always use proper TypeScript types for requests/responses
- Handle errors appropriately in try/catch blocks

### 2. Response Handling
- Expect `PaginatedResponse<T>` for list endpoints
- Update store state after successful operations
- Always call refresh methods after CRUD operations

## File Naming Conventions

### 1. Components
- PascalCase: `DepartmentCreate.vue`, `UserEdit.vue`
- Descriptive and action-oriented names

### 2. Files and Directories
- kebab-case for directories: `department-management/`
- camelCase for TypeScript files: `departmentService.ts`
- PascalCase for Vue components

## Import Organization

### 1. Import Order
```typescript
// 1. Vue/Nuxt imports
// 2. Component imports (alphabetical)
// 3. Service/Store imports
// 4. Type imports
// 5. Utility imports
```

### 2. Import Style
```typescript
// Good
import type { DepartmentDto, DepartmentFilters } from '~/views/departments/types'

// Bad
import { DepartmentDto, DepartmentFilters } from '~/views/departments/types'
```

## Error Handling Rules

### 1. Store Methods
- Always wrap in try/catch/finally
- Set loading states properly
- Log errors with descriptive messages
- Throw errors for UI handling when needed

### 2. Component Methods
- Handle validation before API calls
- Show appropriate user feedback
- Reset forms after successful operations

## Performance Rules

### 1. Computed Properties
- Use computed for derived state
- Prefer computed over methods for reactive data

### 2. Watchers
- Use deep watching for complex objects
- Clean up watchers when needed
- Avoid excessive API calls in watchers

## Security Rules


### 2. Data Validation
- Validate on both client and expect server validation
- Sanitize user inputs
- Use proper TypeScript types for type safety

## Code Quality Rules

### 1. TypeScript
- Always use strict typing
- Avoid `any` type
- Use proper interfaces and types
- Export types separately from implementations

### 2. Vue Composition API
- Use `<script setup>` syntax
- Prefer composition over options API
- Use proper reactive references

### 3. Code Organization
- Keep components focused and single-purpose
- Extract reusable logic into composables
- Maintain consistent code structure across modules

## Testing Considerations
- Ensure components work with Arabic text (RTL)
- Test privilege-based access control
- Validate API integration with proper error handling
- Test form validation with Arabic error messages

## Documentation
- Comment complex business logic
- Document API integration patterns
- Maintain type definitions with proper JSDoc when needed
- Keep README updated with Arabic-specific considerations
