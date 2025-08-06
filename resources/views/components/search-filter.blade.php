@props(['placeholder' => 'Search...', 'filters' => []])

<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
            <input type="text" placeholder="{{ $placeholder }}" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        @if(!empty($filters))
            <div class="flex gap-2">
                @foreach($filters as $filter)
                    <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        @foreach($filter['options'] as $option)
                            <option>{{ $option }}</option>
                        @endforeach
                    </select>
                @endforeach
                <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Search
                </button>
            </div>
        @endif
    </div>
</div> 