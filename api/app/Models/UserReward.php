<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class UserReward extends Model

{

    protected $table = 'user_rewards';
 
    protected $fillable = [

        'user_id',

        'points',

        'last_spin_date',

        'last_reward_type',

        'last_reward_value',

    ];
 
    protected $casts = [

        'last_spin_date' => 'date',

    ];

}
 