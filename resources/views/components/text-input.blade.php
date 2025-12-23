@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'border border-gray-300 focus:border-blue-600 focus:outline-none rounded-md transition-colors']) }}>
