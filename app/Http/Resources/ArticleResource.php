<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
             ...$this->resource->toArray(),
            "image_url" => count($this->resource->images )? env('APP_URL') . '/storage/' . $this->resource->images->first()?->image : null,
            'category_name' => $this->category?->name,
        ];
    }
}
