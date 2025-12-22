@props([
    'name',
    'show' => false,
    'maxWidth' => '2xl'
])

@php
$maxWidth = [
    'sm' => 'sm:max-w-sm',
    'md' => 'sm:max-w-md',
    'lg' => 'sm:max-w-lg',
    'xl' => 'sm:max-w-xl',
    '2xl' => 'sm:max-w-2xl',
][$maxWidth];
@endphp

<div
    data-modal
    data-modal-name="{{ $name }}"
    class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50"
    style="display: {{ $show ? 'block' : 'none' }};"
>
    <div
        data-modal-backdrop
        class="fixed inset-0 transform transition-all"
        style="background-color: rgba(0, 0, 0, 0.5);"
    >
    </div>

    <div
        data-modal-content
        class="mb-6 bg-white rounded-md overflow-hidden transform transition-all sm:w-full {{ $maxWidth }} sm:mx-auto"
        style="display: {{ $show ? 'block' : 'none' }};"
    >
        {{ $slot }}
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('[data-modal-name="{{ $name }}"]');
    if (modal) {
        new Modal(modal, { name: '{{ $name }}', show: {{ $show ? 'true' : 'false' }} });
    }
});
</script>
