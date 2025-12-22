@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'border-2 border-gray-300 focus:border-blue-600 focus:outline-none rounded-md transition-colors']) }}>
