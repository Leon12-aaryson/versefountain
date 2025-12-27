# Convert Blade Components with Slots to @extends Pattern

## Overview
Convert Blade components that use `{{ $slot }}` to traditional Laravel `@extends` layout pattern. This aligns with Laravel's traditional approach and makes the codebase more consistent.

## Components Analysis

### Components Using Slots:
1. **`auth-card.blade.php`** - Used in `auth/register.blade.php` and `auth/login.blade.php`
   - Has props: `title`, `description`, `activeTab`
   - Wraps form content
   - **Convert to layout**: `layouts/auth-card.blade.php`

2. **`modal.blade.php`** - Not currently used, but has slot structure
   - Has props: `name`, `show`, `maxWidth`
   - Wraps modal content
   - **Convert to layout**: `layouts/modal.blade.php` (if needed)

3. **Button Components** (simple wrappers):
   - `primary-button.blade.php` - Used in profile forms
   - `danger-button.blade.php` - Used in profile forms
   - `secondary-button.blade.php` - Used in profile forms
   - **Strategy**: Inline these directly or keep as simple HTML helpers

4. **Link Components** (simple wrappers):
   - `nav-link.blade.php` - Navigation links
   - `responsive-nav-link.blade.php` - Responsive nav links
   - `dropdown-link.blade.php` - Dropdown menu links
   - **Strategy**: Inline these directly where used

5. **Other Components**:
   - `dropdown.blade.php` - Uses named slots (`$trigger`, `$content`)
   - `input-label.blade.php` - Uses `$value ?? $slot`
   - **Strategy**: Convert to partials or inline

## Implementation Strategy

### Phase 1: Convert `auth-card` Component
1. Create `resources/views/layouts/auth-card.blade.php` as a layout
2. Use `@yield('auth-card-content')` instead of `{{ $slot }}`
3. Pass props via `@section` or view data
4. Update `auth/register.blade.php` to use `@extends('layouts.auth-card')`
5. Update `auth/login.blade.php` to use `@extends('layouts.auth-card')`

### Phase 2: Handle Simple Button Components
1. Find all usages of `<x-primary-button>`, `<x-danger-button>`, `<x-secondary-button>`
2. Replace with inline button HTML using the same classes
3. Remove component files

### Phase 3: Handle Link Components
1. Find all usages of `<x-nav-link>`, `<x-responsive-nav-link>`, `<x-dropdown-link>`
2. Replace with inline anchor tags using the same classes
3. Remove component files

### Phase 4: Handle Other Components
1. Convert `dropdown.blade.php` to use `@include` with partials
2. Convert `input-label.blade.php` to inline or partial
3. Handle `modal.blade.php` if it gets used in the future

## Files to Modify

### Create New Layouts:
1. `resources/views/layouts/auth-card.blade.php` - New layout for auth card

### Update Templates:
1. `resources/views/auth/register.blade.php` - Convert to use `@extends`
2. `resources/views/auth/login.blade.php` - Convert to use `@extends`
3. `resources/views/profile/partials/update-profile-information-form.blade.php` - Inline buttons
4. `resources/views/profile/partials/update-password-form.blade.php` - Inline buttons
5. `resources/views/profile/partials/delete-user-form.blade.php` - Inline buttons
6. `resources/views/auth/verify-email.blade.php` - Inline buttons
7. `resources/views/auth/confirm-password.blade.php` - Inline buttons

### Remove Component Files:
1. `resources/views/components/auth-card.blade.php`
2. `resources/views/components/primary-button.blade.php`
3. `resources/views/components/danger-button.blade.php`
4. `resources/views/components/secondary-button.blade.php`
5. `resources/views/components/nav-link.blade.php` (if not used)
6. `resources/views/components/responsive-nav-link.blade.php` (if not used)
7. `resources/views/components/dropdown-link.blade.php` (if not used)

## Implementation Details

### auth-card Conversion:
- Current: `<x-auth-card title="..." description="..." activeTab="...">content</x-auth-card>`
- New: `@extends('layouts.auth-card')` with `@section('auth-card-content')` and pass data via `@section('auth-card-title')`, etc.

### Button Components:
- Current: `<x-primary-button>Save</x-primary-button>`
- New: `<button type="submit" class="inline-flex items-center px-4 py-2 bg-blue-600...">Save</button>`

## Notes
- Keep component files that don't use slots (like `input-error.blade.php`, `page-header.blade.php`)
- For components with complex logic, consider using `@include` with partials instead
- This conversion maintains functionality while using Laravel's traditional layout pattern

