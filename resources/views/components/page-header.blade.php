@props(['title', 'description' => null])

<div class="mb-8">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{{ $title }}</h1>
    @if($description)
        <p class="text-gray-600">{{ $description }}</p>
    @endif
</div> 