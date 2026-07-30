<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\ResolvesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomInformationResource extends JsonResource
{
    use ResolvesLocale;

    /**
     * Transform the resource into an array.
     *
     * title and description are display prose and get translated; `subtitle` is
     * left as-is because the tech-stack query groups on it as a machine key.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->resource->toArray(),
            ...$this->localizedFields($request, ['title', 'description']),
            "type" => $this->resource->type ? $this->resource->type->name : null,
            "type_id" => $this->resource->type ? $this->resource->type->id : null,
            "image_url" => $this->resource->image ? asset("storage/{$this->resource->image}") : null,
        ];
    }
}
