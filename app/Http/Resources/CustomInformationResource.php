<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomInformationResource extends JsonResource
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
            "type" => $this->resource->type ? $this->resource->type->name : null,
            "type_id" => $this->resource->type ? $this->resource->type->id : null,
            "image_url" => $this->resource->image ? asset("storage/{$this->resource->image}") : null,
        ];
    }
}
