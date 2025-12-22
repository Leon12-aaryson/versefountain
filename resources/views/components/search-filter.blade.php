@props(['placeholder' => 'Search...', 'filters' => []])

<div class="bg-white rounded-md p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
            <input type="text" placeholder="{{ $placeholder }}" 
                   class="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-600 focus:outline-none transition-colors">
        </div>
        @if(!empty($filters))
            <div class="flex gap-2">
                @foreach($filters as $filter)
                    <select class="px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-600 focus:outline-none transition-colors">
                        @foreach($filter['options'] as $option)
                            <option>{{ $option }}</option>
                        @endforeach
                    </select>
                @endforeach
                <button class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:border-2 focus:border-blue-800 border-2 border-transparent">
                    Search
                </button>
            </div>
        @endif
    </div>
</div> 