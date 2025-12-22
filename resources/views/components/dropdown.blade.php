@props(['align' => 'right', 'width' => '48', 'contentClasses' => 'py-1 bg-white'])

@php
$alignmentClasses = match ($align) {
    'left' => 'ltr:origin-top-left rtl:origin-top-right start-0',
    'top' => 'origin-top',
    default => 'ltr:origin-top-right rtl:origin-top-left end-0',
};

$width = match ($width) {
    '48' => 'w-48',
    default => $width,
};
@endphp

<div class="relative" data-dropdown>
    <div data-dropdown-toggle>
        {{ $trigger }}
    </div>

    <div data-dropdown-menu
            class="absolute z-50 mt-2 {{ $width }} rounded-md {{ $alignmentClasses }}"
            style="display: none;">
        <div class="rounded-md ring-1 ring-black ring-opacity-5 {{ $contentClasses }}">
            {{ $content }}
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Find the specific dropdown in this component
    const dropdowns = document.querySelectorAll('[data-dropdown]');
    dropdowns.forEach(dropdown => {
        if (!dropdown.dataset.initialized) {
            new Dropdown(dropdown);
            dropdown.dataset.initialized = 'true';
        }
    });
});
</script>
