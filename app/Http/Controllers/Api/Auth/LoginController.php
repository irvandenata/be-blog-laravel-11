<?php
namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        //set validation
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required'
        ]);

        //if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        //get credentials from request
        $credentials = $request->only('email', 'password');

        //if auth failed

        if (!$token = auth()->guard('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password Anda salah'
            ], 401);
        }


        $user = auth()->guard('api')->user();

        //if auth success
        $customClaims = [
            'user_id' => $user->id,
            'email' => $user->email,
            'name' => $user->name
        ];

        $token = auth()->guard('api')->claims($customClaims)->attempt($credentials);
        // return cookie('token', $token, 60);
        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->guard('api')->factory()->getTTL() * 60,
            ]
        ], 200);
    }

    public function logout()
    {
        $removeToken = \JWTAuth::invalidate(\JWTAuth::getToken());
        if ($removeToken) {
            //return response JSON
            return response()->json([
                'success' => true,
                'message' => 'Logout Berhasil!',
            ]);
        } else {
            //return response JSON
            return response()->json([
                'success' => false,
                'message' => 'Logout Gagal!',
            ]);
        }
    }

    public function refresh()
    {
        return response()->json([
            'success' => true,
            'message' => 'Token berhasil diperbaharui',
            'data' => [
                'token' => auth()->guard('api')->refresh(),
                'token_type' => 'bearer',
                'expires_in' => auth()->guard('api')->factory()->getTTL() * 60,
            ]
        ], 200);
    }
}
