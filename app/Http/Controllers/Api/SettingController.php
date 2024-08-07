<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Intervention\Image\Laravel\Facades\Image;
use Storage;

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

    public function updateData(Request $request)
    {
        $settingData = file_get_contents(public_path('setting.json'));
        $imagePath = json_decode($settingData, true)['header']['image'];
        if ($request->hasFile('header_image')) {
            // convert to webp
            $image = Image::read($request->file('header_image'))
                ->toWebp();
            $path = 'images/setting/' . rand(1000, 9999) . '.webp';

            Storage::disk('public')->put($path, $image);
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $path;
        }

        $data = [
            "header" => [
                'title' => $request->header_title,
                'description' => $request->header_description,
                'image' => $imagePath,
            ]
        ];
        // write setting.json from public folder

        return response()->json([
            'success' => true,
            'message' => 'setting data updated',
            'data' => $data
        ], 200);
    }
}
