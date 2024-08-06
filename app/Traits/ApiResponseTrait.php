<?php

namespace App\Traits;

trait ApiResponseTrait
{
  protected function successResponse($data, $message = '', $code = 200)
  {
    return response()->json([
      'success' => true,
      'message' => $message,
      'data' => $data,
    ], $code);
  }
  /**
   * Generate a JSON response for error.
   *
   * @param string $message
   * @param int $status
   * @return \Illuminate\Http\JsonResponse
   */
  protected function errorResponse($message = '', $code = 409)
  {
    return response()->json([
      'success' => false,
      'message' => $message,
    ], $code);
  }
}
