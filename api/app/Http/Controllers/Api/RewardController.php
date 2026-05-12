<?php
 
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\UserReward;

use Carbon\Carbon;
 
class RewardController extends Controller

{

    public function me(Request $request)

    {

        $user = $request->user();
 
        if (!$user) {

            return response()->json([

                'message' => 'Usuario no autenticado'

            ], 401);

        }
       // return response()->json($user);
        $reward = UserReward::firstOrCreate(

            ['user_id' => $user->id_usuario],

            [

                'points' => 0,

                'last_spin_date' => null,

                'last_reward_type' => null,

                'last_reward_value' => null,

                'last_reward_label' => null,

            ]

        );
 
        return response()->json($reward);

    }
 
    public function spin(Request $request)

    {

        $user = $request->user();
 
        if (!$user) {

            return response()->json([

                'message' => 'Usuario no autenticado'

            ], 401);

        }
 
        $reward = UserReward::firstOrCreate(

            ['user_id' => $user->id],

            [

                'points' => 0,

                'last_spin_date' => null,

                'last_reward_type' => null,

                'last_reward_value' => null,

                'last_reward_label' => null,

            ]

        );
 
        $today = Carbon::today()->toDateString();
 
        if ($reward->last_spin_date === $today) {

            return response()->json([

                'message' => 'Ya giraste hoy'

            ], 400);

        }
 
        $prizes = [

            ['type' => 'points', 'value' => 5, 'label' => '5 puntos'],

            ['type' => 'points', 'value' => 10, 'label' => '10 puntos'],

            ['type' => 'points', 'value' => 15, 'label' => '15 puntos'],

            ['type' => 'points', 'value' => 20, 'label' => '20 puntos'],

            ['type' => 'discount', 'value' => 5, 'label' => '5% OFF'],

            ['type' => 'shipping', 'value' => 0, 'label' => 'FREE'],

        ];
 
        $selected = $prizes[array_rand($prizes)];
 
        if ($selected['type'] === 'points') {

            $reward->points += $selected['value'];

        }
 
        $reward->last_spin_date = $today;

        $reward->last_reward_type = $selected['type'];

        $reward->last_reward_value = $selected['value'];

        $reward->last_reward_label = $selected['label'];

        $reward->save();
 
        return response()->json([

            'points' => $reward->points,

            'reward' => $selected,

        ]);

    }

}
 