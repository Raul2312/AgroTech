<?php
 
 
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserReward;
use Carbon\Carbon;
 
class RewardController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();
 
        $reward = UserReward::firstOrCreate(
            ['user_id' => $user->id],
            [
                'points' => 0,
                'last_spin_date' => null,
                'last_reward_type' => null,
                'last_reward_value' => 0,
            ]
        );
 
        return response()->json($reward);
    }
 
    public function spin(Request $request)
    {
        $user = $request->user();
 
        $reward = UserReward::firstOrCreate(
            ['user_id' => $user->id],
            [
                'points' => 0,
                'last_spin_date' => null,
                'last_reward_type' => null,
                'last_reward_value' => 0,
            ]
        );
 
        $today = Carbon::today()->toDateString();
 
        if ($reward->last_spin_date === $today) {
            return response()->json([
                'message' => 'Ya giraste hoy'
            ], 400);
        }
 
        $prizes = [
            ['type' => 'points', 'value' => 5],
            ['type' => 'points', 'value' => 10],
            ['type' => 'points', 'value' => 15],
            ['type' => 'points', 'value' => 20],
            ['type' => 'discount', 'value' => 5],
            ['type' => 'shipping', 'value' => 0],
        ];
 
        $selected = $prizes[array_rand($prizes)];
 
        if ($selected['type'] === 'points') {
            $reward->points += $selected['value'];
        }
 
        $reward->last_spin_date = $today;
        $reward->last_reward_type = $selected['type'];
        $reward->last_reward_value = $selected['value'];
        $reward->save();
 
        return response()->json([
            'points' => $reward->points,
            'reward' => $selected,
        ]);
    }
}