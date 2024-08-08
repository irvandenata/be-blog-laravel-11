<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Resource extends JsonResource
{
    //define properti
    public $status;
    public $message;
    protected $customResource;

    /**
     * __construct
     *
     * @param  mixed $status
     * @param  mixed $message
     * @param  mixed $resource
     * @return void
     */
    public function __construct($status, $message, $resource,$customResource = null)
    {
        parent::__construct($resource);
        $this->status = $status;
        $this->message = $message;
        $this->customResource = $customResource;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = $this->resource->toArray();
        return [
            'success' => $this->status,
            'message' => $this->message,
            'meta' => [
                'total' => $data['total'],
                'per_page' => $data['per_page'],
                'current_page' => $data['current_page'],
                'last_page' => $data['last_page'],
            ],
            'data' => $this->customResource ? $this->customResource::collection($this->resource->items()) : $data['data'],
        ];
    }
}
