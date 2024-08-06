<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * get setting data
     * @return \Illuminate\Http\JsonResponse
     */
    public function getData()
    {
        $data = [];
        // read setting.json from public folder
        $setting = file_get_contents(public_path('setting.json'));
        $data = json_decode($setting, true);
        return response()->json([
            'success' => true,
            'message' => 'this is setting data',
            'data' => $data
        ], 200);
    }
}
