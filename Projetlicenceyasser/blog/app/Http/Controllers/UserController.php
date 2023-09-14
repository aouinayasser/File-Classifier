<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
   public function register(Request $request) {

       $role_id = 2;

       $user = User::where('email', $request['email'])->first();
       if ($user) {
           $response['status'] = 0;
           $response['message'] = 'Email already exists';
           $response['code'] = 409;

       }
       else {
       $user = User::create([
           'role_id' => $role_id,
           'name'  => $request->name,
           'email' => $request->email,
           'password' => bcrypt($request->password)
       ]);
           $response['status'] = 1;
           $response['message'] = 'Account created successfully';
           $response['code'] = 200;

       }
       return response()->json($response);
   }

   public function login(Request $request) {
       $credentials = $request->only('email', 'password');
       try {
           if (!auth('api')->attempt($credentials)) {
               $response['status'] = 0;
               $response['message'] = 'Email or password is incorrect';
               $response['data'] = null;
               $response['code'] = 401;
               return response()->json($response);
           }
       } catch (JWTException $e) {
           $response['data'] = null;
           $response['message'] = 'Could not create token';
           $response['code'] = 500;
           return response()->json($response);
       }
        $user = auth('api')->user();
        $data['token'] = auth('api')->claims([
            'id' => $user->id,
            'email' => $user->email
        ])->attempt($credentials);

       $response['data'] = $data;
       $response['status'] = 1;
       $response['message'] = 'Login Successfully';
       $response['code'] = 200;
       return response()->json($response);
   }
}
