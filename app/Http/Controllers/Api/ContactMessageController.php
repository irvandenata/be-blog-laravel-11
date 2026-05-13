<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Http\Resources\Resource;
use App\Models\ContactMessage;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactMessageController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request): JsonResource
    {
        $query = ContactMessage::query();

        if ($request->search) {
            $query->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('subject', 'like', '%' . $request->search . '%')
                    ->orWhere('message', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->boolean('unread_only')) {
            $query->whereNull('read_at');
        }

        $messages = $query
            ->orderByRaw('CASE WHEN read_at IS NULL THEN 0 ELSE 1 END')
            ->latest()
            ->paginate($request->per_page ?? 10, ['*'], 'page', $request->page ?? 1);

        return new Resource(true, 'Data retrieved successfully', $messages, ContactMessageResource::class);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'subject' => ['nullable', 'string', 'max:150'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $message = ContactMessage::create($validated);

        return $this->successResponse(new ContactMessageResource($message), 'Message has been sent.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        return $this->successResponse(new ContactMessageResource($message), 'Data found.');
    }

    public function markAsRead(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        if (!$message->read_at) {
            $message->update([
                'read_at' => now(),
            ]);
        }

        return $this->successResponse(new ContactMessageResource($message->refresh()), 'Message has been marked as read.');
    }

    public function notifications(): JsonResponse
    {
        $messages = ContactMessage::query()
            ->latest()
            ->limit(5)
            ->get();

        return $this->successResponse([
            'unread_count' => ContactMessage::whereNull('read_at')->count(),
            'messages' => ContactMessageResource::collection($messages)->resolve(),
        ], 'Notifications retrieved successfully.');
    }

    public function destroy(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return $this->successResponse(new ContactMessageResource($message), 'Data has been deleted successfully.');
    }
}
