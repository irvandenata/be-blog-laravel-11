<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\ResolvesLocale;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    use ResolvesLocale;

    /**
     * Transform the resource into an array.
     *
     * The spread runs first so the raw *_en columns stay available to the admin
     * editor; the locale-resolved values then overwrite title/content so public
     * pages get English where it exists and Indonesian where it does not.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
             ...$this->resource->toArray(),
            ...$this->localizedFields($request, [
                'title',
                'content',
                'meta_description',
                'meta_keywords',
            ]),
            'locale' => $this->requestLocale($request),
            // Lets the blog tell the reader the English version is missing,
            // instead of silently showing Indonesian copy on an /en URL.
            'is_translated' => $this->hasTranslation($request, 'content'),
            "image_url" => count($this->resource->images )? env('APP_URL') . '/storage/' . $this->resource->images->first()?->image : null,
            'category_name' => $this->category?->name,
        ];
    }
}
